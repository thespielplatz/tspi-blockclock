const {
  OutputRendererFactory,
  Ws281xNotSupported,
} = require('../outputRenderers/OutputRendererFactory')
const ConsoleOutputRenderer = require('../outputRenderers/ConsoleOutputRenderer')
const getLogger = require('../Logger')
const PixelDisplayRenderer = require('../PixelDisplayRenderer')
const SocketGames = require('../SocketGames')

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
  logger.info('- display initialized')

  // ------------ PixelDisplayRenderer
  const displayRenderer = new PixelDisplayRenderer({ logger })
  logger.info('- displayRenderer initialized')

  // ------------ SocketGames Connection
  const url = process.env.BLOCKTRIS_SOCKET_API
  logger.info(`- connecting to socket server ${url}`)
  const screenId = process.env.BLOCKTRIS_SCREEN_ID
  const socketGames = new SocketGames({ url, screenId })
  try {
    const data = await socketGames.init()
    if (data.screenId !== screenId) {
      logger.error(
        'wrong screenId sent from socket server',
        { url, screenId },
        data,
      )
      process.exit(1)
    }
  } catch (error) {
    logger.error(
      'unable to connect to socket server',
      { url, screenId },
      error,
    )
    process.exit(1)
  }
  logger.info(`- socket server ${url} connection established`)

  // ------------ Main State Machine
  logger.info('- TODO : add state machine')
  let inFrame = false

  // ------------ Game Loop
  const renderFrame = () => {
    setTimeout(renderFrame, 3000)
    if (inFrame) {
      logger.warn('⚠️ frameskip ⚠️')
      return
    }
    inFrame = true
    displayRenderer.writeLine('a bc')
    outputRenderer.render(displayRenderer.pixelData)
    inFrame = false
  }
  renderFrame()
  logger.info('- game loop started')

  logger.info('Blocktris started')
}

module.exports = startup
