console.info('Blocktris Starting ...')

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
      sm.switchTo(sm.STATE_STARTUP)
      sm.sendMessage({ message: 'error', text: 'S:screen id'})
    } else {
      sm.switchTo(sm.STATE_STARTUP)
    }
  },
  onError: (error) => {
    console.error('SocketGames: onError', { error })
    sm.switchTo(sm.STATE_STARTUP)
    sm.sendMessage({ message: 'error', text: 'S:error'})
  },
})

// ------------ Main State Machine

const { Statemachine, STATE_STARTUP } = require('./blocktris/statemachine')
sm = new Statemachine(display)
sm.switchTo(STATE_STARTUP)

setInterval(function () {
  sm.render()
  render.render(display.getPixelData())
}, 1000 / FPS)


