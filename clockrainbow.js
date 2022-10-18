console.info('Blockclock Starting ...')

const render = require('./lib/render.js')
const display = require('./lib/display.js')

const rainbow = require('./blockclock/rainbow.js')
const blocktime = require('./blockclock/blocktime.js')
const movingblock = require('./blockclock/movingblock.js')

const NUM_LEDS = 250
const FPS = 60
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

render.init(NUM_LEDS, 100, WIDTH)

display.init(WIDTH, HEIGHT)
display.setColors(0xFFFFFF, display.NOT_SET)

rainbow.init(NUM_LEDS, 1.0)

setInterval(function () {
  rainbow.nextStep(display)
  movingblock.render(display)
  blocktime.render(display)

  render.render(display.getPixelData())
}, 1000 / FPS)


blocktime.start()

blocktime.setNewBlockStartCallback(() => {
  rainbow.setBrightness(0.8)
})

blocktime.setNewBlockEndCallback(() => {
  rainbow.setBrightness(0)

  movingblock.start(WIDTH, HEIGHT, 0, 12)

  movingblock.setFinishedCallback(() => {
    //rainbow.fadeOn()
  })
})
