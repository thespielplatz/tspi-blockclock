console.info('Blocktris start')

require('dotenv').config()
const render = require('./lib/render.js')
const display = require('./lib/display.js')
const SocketGames = require('./lib/SocketGames.js')

const NUM_LEDS = 250
const FPS = 60
const WIDTH = 50
const HEIGHT = 5

// ------------ Proccess exit

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


// ------------ Renderer and Display

render.init(NUM_LEDS, 50, WIDTH)

display.init(WIDTH, HEIGHT)
display.setColors(0xFf0000, display.NOT_SET)

// ------------ socket.games connection

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

let text = "Little Hodler"

// ------------ Main State Machine

const STATE_INIT = 'STATE_INIT'
const STATE_IDLE = 'STATE_IDLE'

let app_state = STATE_IDLE

const screen_wait = require('./tetris/screen-wait.js')
screen_wait.init(display)

setInterval(function () {
  display.fill(pixelData, 0x000000)
  display.writeLine(pixelData, text)
  //render.render(pixelData)
  text = '#' + text

  switch (app_state) {
    case STATE_INIT:
      screen_wait.render()
      break;
  }


  render.render(pixelData)
}, 1000 / FPS)


