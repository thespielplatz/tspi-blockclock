console.info('Blocktris start')

require('dotenv').config()
const render = require('./lib/render.js')
const display = require('./lib/display.js')
const tetris = require('./lib/tetris/tetris.js')
const SocketGames = require('./lib/SocketGames.js')

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

render.init(NUM_LEDS, 50, WIDTH)

display.init(WIDTH, HEIGHT)
display.setColors(0xFf0000, display.NOT_SET)

tetris.setup(HEIGHT, WIDTH)

let text = "Little Hodler"
let pixelData = new Uint32Array(NUM_LEDS)

const tetrisDisplay = {
  setPixel: (x, y, c) => {
    display.setPixel(pixelData, y,  HEIGHT - x - 1, c)
  }
}

setInterval(function () {
  display.fill(pixelData, 0x000000)
  //display.writeLine(pixelData, text)
  //render.render(pixelData)
  text = '#' + text

  tetris.update(1.0 / FPS)
  tetris.draw(tetrisDisplay)
  render.render(pixelData)
}, 1000 / FPS)

const SCREEN_ID = 'tspi-blockclock'
const socketGames = new SocketGames({
  url: process.env.SOCKET_API,
  screenId: SCREEN_ID,
  onConnect: (data) => {
    if (data.screenId !== SCREEN_ID) {
      console.error('wrong screenId sent from BE!')
    }
  },
  onError: (error) => {
    console.error('SocketGames: onError', { error })
  },
})
socketGames.on('turn', () => {
  tetris.actionTurn()
})
socketGames.on('left', () => {
  tetris.actionLeft()
})
socketGames.on('right', () => {
  tetris.actionRight()
})
socketGames.on('down-pressed', () => {
  tetris.actionDown(true)
})
socketGames.on('down-released', () => {
  tetris.actionDown(false)
})
