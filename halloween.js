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

const sleep = (waitTimeInMs) => new Promise(resolve => setTimeout(resolve, waitTimeInMs))

/*
const rl = readline.createInterface({input: process.stdin, output: process.stdout})
rl.question('Press [q] to quit: ', answer)

async function answer(ans) {
  display.fill(0xFFFFFF)

  await sleep(1000)
  display.fill(0x0)

  if (ans == 'q') console.log('i will continue')
  else console.log('i will not continue')
  rl.close()
}
*/

let waitTime = 0
let onTime = 0
let repeat

let animating = false

async function animationLoop() {
  animating = true

  waitTime = 1000 + Math.random() * 2000
  onTime = 50 + Math.random() * 150

  repeat = 1 + Math.floor(Math.random() * 4)

  await sleep(waitTime)

  for (let i = 0; i < repeat; i++) {
    display.fill(0xFFFFFF)
    await sleep(onTime)
    display.fill(0x0)
    await sleep(onTime)
  }

  animating = false
}

setInterval(function () {
  if (!animating) animationLoop()

  render.render(display.getPixelData())
}, 1000 / FPS)
