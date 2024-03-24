const {
  DisplayFactory,
  WS281xNotSupported,
} = require('../display/DisplayFactory')
const getLogger = require('../Logger')
const PixelRenderer = require('../PixelRenderer')

const startup = () => {
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
  logger.info('- TODO : add socket.games connection')

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
    renderer.writeChar('a')
    display.draw(renderer.pixelData)
    inFrame = false
  }
  renderFrame()
  logger.info('- game loop started')

  logger.info('Blocktris started')
}

module.exports = startup
