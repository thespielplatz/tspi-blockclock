const {
  DisplayFactory,
  WS281xNotSupported,
} = require('../display/DisplayFactory')
const getLogger = require('../Logger')
const PixelRenderer = require('../PixelRenderer')
const SocketGames = require('../SocketGames')

const startup = async () => {
  const isWS281xSupported = DisplayFactory.isWS281xSupported()
  const logToFile = isWS281xSupported instanceof WS281xNotSupported

  const logger = getLogger({ logToFile })
  logger.info('Blocktris starting up ...')

  // ------------ Renderer
  const renderer = new PixelRenderer({ logger })
  logger.info('- renderer initialized')

  // ------------ Display
  const display = DisplayFactory.getDisplay()
  if (isWS281xSupported instanceof WS281xNotSupported) {
    logger.warn(`drawing blocktris on stdout: ${isWS281xSupported.reason}`)
  }
  logger.info('- display initialized')

  // ------------ SocketGames Connection
  const url = process.env.BLOCKTRIS_SOCKET_API
  logger.info(`- conecting to socket server ${url}`)
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
  logger.info(`- ${url} connection initialized`)

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
    renderer.writeLine('a bc')
    display.draw(renderer.pixelData)
    inFrame = false
  }
  renderFrame()
  logger.info('- game loop started')

  logger.info('Blocktris started')
}

module.exports = startup
