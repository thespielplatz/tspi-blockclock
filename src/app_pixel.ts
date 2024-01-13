import getConfig from './lib/configParser'

const RendererFactory = require('../lib/Renderer/RendererFactory.js')
const PixelDisplay = require('../lib/PixelDisplay.js')

console.info('Just Rendering pixels ...')

const CONFIG = getConfig()

const appArgs = process.argv.slice(2)
if (appArgs.length <= 0) {
  console.info('Arguments needed: <num_of_pixel as int> <color as int|optional>')
  console.info('- White: 16777215')
  console.info('- Red: 16711680')
  console.info('- Green: 65280')
  console.info('- Blue: 255')
  console.info('- Yellow: 16776960')

  process.exit(0)
}

const numOfPixels = parseInt(appArgs[0])
const pixelColor = (appArgs.length >= 2 ? parseInt(appArgs[1]) : 0xFFFFFF)

const renderer = RendererFactory.getRenderer({
  numLeds: numOfPixels,
  brightness: CONFIG.WS281X.brightness,
  width: numOfPixels,
  revertedRows: '',
})
renderer.init()

const display = new PixelDisplay(numOfPixels, 1)
display.setColors(0xFFFFFF, PixelDisplay.NOT_SET)
display.fill(0)

const draw = () => {
  display.fill(pixelColor)
  renderer.render(display.getPixelData())
}

draw()

setInterval(function () {
  draw()
}, 1000)
