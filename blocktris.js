console.info('Blocktris start')

const render = require('./lib/render.js')
const display = require('./lib/display.js')

const NUM_LEDS = 250
const FPS = 2//60
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
display.setColors(0xFf0000, display.NOT_SET)

let text = "Little Hodler"

setInterval(function () {
  let pixelData = new Uint32Array(NUM_LEDS)

  display.writeLine(pixelData, text)
  render.render(pixelData)
  text = '#' + text
}, 1000 / FPS)

