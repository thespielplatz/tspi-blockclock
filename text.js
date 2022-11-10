console.info('Just Rendering Text ...')

require('dotenv').config()
const render = require('./lib/render.js')
const display = require('./lib/display.js')

const FPS = process.env.DISPLAY_FPS || 60
const WIDTH = process.env.DISPLAY_WIDTH || 50
const HEIGHT = process.env.DISPLAY_HEIGHT || 5
const BRIGHTNESS = process.env.DISPLAY_BRIGHTNESS || 50
const NUM_LEDS = WIDTH * HEIGHT

process.on('unhandledRejection', error => {
  console.error(error)
  render.deinit()
  process.nextTick(function () { process.exit(1) })
})

process.on('uncaughtException', error => {
  console.error(error)
  render.deinit()
  process.nextTick(function () { process.exit(1) })
})

// ---- trap the SIGINT and reset before exit
process.on('SIGINT', function () {
  render.deinit()
  process.nextTick(function () { process.exit(0) })
})

render.init(NUM_LEDS, BRIGHTNESS, WIDTH)

display.init(WIDTH, HEIGHT)
display.setColors(0xFFFFFF, display.NOT_SET)
display.fill(0)

const appArgs = process.argv.slice(2);
const text = (appArgs.length >= 1 ? appArgs[0] : "no text")

const draw = () => {
  display.fill(0)
  display.writeLine(text, 1)
  render.render(display.getPixelData())
}

draw()

setInterval(function () {
  draw()
}, 1.0 / FPS)
