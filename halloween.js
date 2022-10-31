console.info('Halloween Starting ...')

const readline = require('readline');

const render = require('./lib/render.js')
const display = require('./lib/display.js')

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

display.fill(0)

const rl = readline.createInterface({input: process.stdin, output: process.stdout})

const sleep = (waitTimeInMs) => new Promise(resolve => setTimeout(resolve, waitTimeInMs));


rl.question('Press [q] to quit: ', answer)

async function answer(ans) {
  display.fill(0xFFFFFF)

  await sleep(1000)
  display.fill(0x0)

  if (ans == 'q') console.log('i will continue')
  else console.log('i will not continue')
  rl.close()
}

setInterval(function () {
  render.render(display.getPixelData())
}, 1000 / FPS)
