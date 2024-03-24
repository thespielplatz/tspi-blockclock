const ConsoleDisplay = require('./lib-v2/display/ConsoleDisplay')
const getLogger = require('./lib-v2/Logger')
const PixelRenderer = require('./lib-v2/PixelRenderer')

const logger = getLogger({ logToFile: true })
const renderer = new PixelRenderer({ logger })
const display = new ConsoleDisplay({ logger })

logger.log('Starting app_tom.js ...')

let inFrame = false
const renderFrame = () => {
  setTimeout(renderFrame, 3000)
  if (inFrame) {
    logger.info('⚠️ frameskip ⚠️')
    return
  }
  inFrame = true
  renderer.writeChar('a')
  display.draw(renderer.pixelData)
  inFrame = false
}
renderFrame()

logger.log('app_tom.js started')
