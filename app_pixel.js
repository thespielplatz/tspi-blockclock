console.info('Just Rendering pixels ...')

require('dotenv').config()
const WS281xRenderer = require('./lib/WS281xRenderer.js')
const PixelDisplay = require('./lib/PixelDisplay.js')

const appArgs = process.argv.slice(2)
if (appArgs <= 0) {
  console.info('Arguments needed: <num_of_pixel as int> <color as int|optional>')
  console.info('- White: 16777215')
  console.info('- Red: 16711680')
  console.info('- Green: 65280')
  console.info('- Blue: 255')
  console.info('- Yellow: 16776960')

  process.exit(0)
}



const pixelIndex = parseInt(appArgs[0])
const pixelColor = (appArgs.length >= 2 ? parseInt(appArgs[1]) : 0xFFFFFF)

const WIDTH = pixelIndex
const HEIGHT = 1
const BRIGHTNESS = parseInt(process.env.DISPLAY_BRIGHTNESS) || 50
const NUM_LEDS = WIDTH * HEIGHT

const renderer = new WS281xRenderer(NUM_LEDS, BRIGHTNESS, WIDTH, '')
renderer.init()

const display = new PixelDisplay(WIDTH, HEIGHT)
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
