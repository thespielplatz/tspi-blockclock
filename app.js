console.info('Neo Pixel Controller')

const render = require('./lib/render.js')
const rainbow = require('./lib/rainbow.js')
const blocktime = require('./lib/blocktime.js')
const movingblock = require('./lib/movingblock.js')
const display = require('./lib/display.js')

const NUM_LEDS = 250
const FPS = 60
const WIDTH = 50
const HEIGHT = 5

const pause = (milliseconds) => new Promise(res => setTimeout(res, milliseconds));

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

rainbow.init(NUM_LEDS, 1.0)

let pixelData = new Uint32Array(NUM_LEDS)
let text = "Little Hodler"
let showrainbow = true

setInterval(function () {
  rainbow.nextStep(pixelData)
  blocktime.render(pixelData)
  movingblock.render(pixelData)
  render.render(pixelData)
}, 1000 / FPS)


blocktime.start()
blocktime.setNewBlockCallback(() => {
  rainbow.setBrightness(0)

  movingblock.start(WIDTH, HEIGHT, 25, 12)

  movingblock.setFinishedCallback(() => {
    rainbow.fadeOn()
  })
})

