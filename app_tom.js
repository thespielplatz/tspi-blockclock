const ConsoleDisplay = require('./lib-v2/display/ConsoleDisplay')
const PixelRenderer = require('./lib-v2/PixelRenderer')

const renderer = new PixelRenderer()
const display = new ConsoleDisplay()

let inFrame = false
const renderFrame = () => {
  setTimeout(renderFrame, 3000)
  if (inFrame) {
    console.info('⚠️ frameskip ⚠️')
    return
  }
  inFrame = true
  renderer.writeChar('a')
  display.draw(renderer.pixelData)
  inFrame = false
}
renderFrame()
