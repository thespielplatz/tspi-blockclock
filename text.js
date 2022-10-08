console.info('Just Rendering Text ...')

const render = require('./lib/render.js')
const display = require('./lib/display.js')
const rainbow = require('./blockclock/rainbow')
const blocktime = require('./blockclock/blocktime')
const movingblock = require('./blockclock/movingblock')

const NUM_LEDS = 250
const WIDTH = 50
const HEIGHT = 5

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

render.init(NUM_LEDS, 50, WIDTH)

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
}, 1000)
