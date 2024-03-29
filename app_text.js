console.info('Just Rendering Text ...')

require('dotenv').config()
const RendererFactory = require('./lib/Renderer/RendererFactory.js')
const PixelDisplay = require('./lib/PixelDisplay.js')

const FPS = parseInt(process.env.DISPLAY_FPS) || 60
const WIDTH = parseInt(process.env.DISPLAY_WIDTH) || 50
const HEIGHT = parseInt(process.env.DISPLAY_HEIGHT) || 5
const BRIGHTNESS = parseInt(process.env.DISPLAY_BRIGHTNESS) || 50
const REVERTED_ROWS = process.env.DISPLAY_REVERTED_ROWS || ''
const NUM_LEDS = WIDTH * HEIGHT

const renderer = RendererFactory.getRenderer({
  numLeds: NUM_LEDS,
  brightness: BRIGHTNESS,
  width: WIDTH,
  revertedRows: REVERTED_ROWS,
})
renderer.init()

const display = new PixelDisplay(WIDTH, HEIGHT)
display.setColors(0xFFFFFF, PixelDisplay.NOT_SET)
display.fill(0)

const appArgs = process.argv.slice(2);
const app_text = (appArgs.length >= 1 ? appArgs[0] : "no text")

const draw = () => {
  display.fill(0)
  display.writeLine(app_text, 1)
  renderer.render(display.getPixelData())
}

draw()

setInterval(function () {
  draw()
}, 1.0 / FPS)
