console.info('Just Rendering Text ...')

require('dotenv').config()
const WS281xRenderer = require('./lib/WS281xRenderer.js')
const display = require('./lib/display.js')

const FPS = process.env.DISPLAY_FPS || 60
const WIDTH = process.env.DISPLAY_WIDTH || 50
const HEIGHT = process.env.DISPLAY_HEIGHT || 5
const BRIGHTNESS = process.env.DISPLAY_BRIGHTNESS || 50
const REVERTED_ROWS = process.env.DISPLAY_REVERTED_ROWS || '1,3'
const NUM_LEDS = WIDTH * HEIGHT

const renderer = new WS281xRenderer(NUM_LEDS, BRIGHTNESS, WIDTH, REVERTED_ROWS)
renderer.init()

display.init(WIDTH, HEIGHT)
display.setColors(0xFFFFFF, display.NOT_SET)
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
