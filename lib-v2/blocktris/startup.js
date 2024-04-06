const {
  OutputRendererFactory,
  Ws281xNotSupported,
} = require('../outputRenderers/OutputRendererFactory')
const ConsoleOutputRenderer = require('../outputRenderers/ConsoleOutputRenderer')
const ScreenManager = require('../screenManager/ScreenManager')
const ErrorScreen = require('../screens/ErrorScreen')
const StartupScreen = require('../screens/StartupScreen')
const getLogger = require('../Logger')
const PixelDisplayRenderer = require('../PixelDisplayRenderer')
const SocketGames = require('../SocketGames')

const ReadyClockScreen = require('./screens/ReadyClockScreen')
const ReadyScreen = require('./screens/ReadyScreen')
const { screenNames } = require('./constants')

const FPS = parseInt(process.env.DISPLAY_FPS) || 60

const startup = async () => {
  // ------------ OutputRenderer + Logger
  const {
    outputRenderer,
    isWs281xSupported,
  } = OutputRendererFactory.getOutputRenderer()
  const logger = getLogger({ logToFile: outputRenderer instanceof ConsoleOutputRenderer })
  logger.info('Blocktris starting up ...')
  if (isWs281xSupported instanceof Ws281xNotSupported) {
    logger.warn(`drawing blocktris on stdout: ${isWs281xSupported.reason}`)
  }
  logger.info('- outputRenderer initialized')

  // ------------ PixelDisplayRenderer
  const displayRenderer = new PixelDisplayRenderer({ logger })
  logger.info('- displayRenderer initialized')

  // ------------ ScreenManager
  const screenManager = new ScreenManager({ logger })
  screenManager.addScreen(new StartupScreen({ screenManager, displayRenderer, logger }, { name: screenNames.startup }))
  screenManager.switchToScreenOnNextFrame(screenNames.startup)
  const switchToErrorScreenAndExit = (message, error) => {
    logger.error(message, { url, screenId }, error)
    screenManager.addScreen(new ErrorScreen({ screenManager, displayRenderer, logger }, { name: screenNames.error }))
    screenManager.switchToScreenOnNextFrame(screenNames.error)
    renderFrame()
    process.exit(1)
  }
  logger.info('- screenManager initialized')

  // ------------ Game Loop
  let inFrame = false
  let lastRender = Date.now()
  const renderFrame = () => {
    setTimeout(renderFrame, 1000 / FPS)
    if (inFrame) {
      logger.warn('⚠️ frameskip ⚠️')
      return
    }
    inFrame = true
    const now = Date.now()
    const updateDeltaInMillis = now - lastRender
    lastRender = now
    screenManager.render(updateDeltaInMillis)
    outputRenderer.render(displayRenderer.pixelData)
    inFrame = false
  }
  renderFrame()
  logger.info('- game loop started')

  // ------------ SocketGames Connection
  const url = process.env.BLOCKTRIS_SOCKET_API
  logger.info(`- connecting to socket server ${url}`)
  const screenId = process.env.BLOCKTRIS_SCREEN_ID
  const socketGames = new SocketGames({ url, screenId })
  try {
    const data = await socketGames.init()
    if (data.screenId !== screenId) {
      switchToErrorScreenAndExit('wrong screenId sent from socket server', data)
    }
  } catch (error) {
    switchToErrorScreenAndExit('unable to connect to socket server', error)
  }
  await new Promise((resolve) => setTimeout(resolve, 1500))
  screenManager.addScreen(new ReadyClockScreen({
    screenManager, displayRenderer, logger,
    socketGames,
  }, {
    name: screenNames.readyClock,
    dropPieceAfterEveryMilliSeconds: parseInt(process.env.BLOCKTRIS_IDLE_SCREEN_DROP_PIECE_AFTER_EVERY_MS) || 0,
  }))
  screenManager.addScreen(new ReadyScreen({
    screenManager, displayRenderer, logger,
    socketGames,
  }, {
    name: screenNames.ready,
    switchToIdleScreenAfterMilliSeconds: parseInt(process.env.BLOCKTRIS_IDLE_SCREEN_AFTER_MS) || 0,
  }))
  screenManager.switchToScreenOnNextFrame(screenNames.ready)
  logger.info(`- socket server ${url} connection established`)

  logger.info('Blocktris started')
}

module.exports = startup