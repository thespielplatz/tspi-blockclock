console.info('Blockclock Starting ...')

const render = require('./lib/render.js')
const display = require('./lib/display.js')

const Blocktime = require('./blockclock/blocktime_updater.js')
const Transactionblock = require('./blockclock/transactionblock.js')

const NUM_LEDS = 250
const FPS = 60
const WIDTH = 50
const HEIGHT = 5
const TRANSACTION_MAX = HEIGHT * HEIGHT

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

const blocktime = new Blocktime()

let blocks = []
blocks.push(new Transactionblock(HEIGHT))
blocks[0].x = 26
blocks.push(new Transactionblock(HEIGHT, true))
blocks[1].x = blocks[0].x + 9
blocks.push(new Transactionblock(HEIGHT, true))
blocks[2].x = blocks[1].x + 6
blocks.push(new Transactionblock(HEIGHT, true))
blocks[3].x = blocks[2].x + 6

setInterval(function () {
  display.fill(0)
  display.writeLine(blocktime.blocktime.toString(), 1)

  display.setPixel(33, 0, 0xFF8800)
  display.setPixel(33, 2, 0xFF8800)
  display.setPixel(33, 4, 0xFF8800)

  for (let i = 0; i < blocks.length; i++) {
    blocks[i].update(1 / FPS)
    blocks[i].render(display)
  }

  render.render(display.getPixelData())
}, 1000 / FPS)


blocktime.start()

blocktime.setNewBlockCallback((blocktime) => {
})

blocktime.setNewBlockCallback((vsize) => {
  let newSize = Math.min(TRANSACTION_MAX, 1 + Math.floor(TRANSACTION_MAX * vsize / (1024 * 1024)))
  blocks[0].setTransactions(newSize)
})

