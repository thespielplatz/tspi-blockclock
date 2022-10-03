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
      switchTo(STATE_STARTUP)
      screen_startup.setError('S:screen id')
    } else {
      switchTo(STATE_STARTUP)
    }
  },
  onError: (error) => {
    console.error('SocketGames: onError', { error })
    switchTo(STATE_STARTUP)
    screen_startup.setError('S:error')
  },
})

// ------------ Main State Machine

const STATE_STARTUP = 'STATE_STARTUP'
const STATE_IDLE = 'STATE_IDLE'

let active_screen = null

const screen_startup = require('./blocktris/screen-startup.js')

const switchTo = (state) => {
  let newScreen = null
  switch (state) {
    case STATE_STARTUP: newScreen = screen_startup; break;
  }

  if (newScreen === active_screen) return
  if (active_screen !== null) active_screen.onExit()
  if (newScreen === null) return

  active_screen = newScreen
  active_screen.onEnter(display)
}

switchTo(STATE_STARTUP)

setInterval(function () {
  active_screen.render()

  render.render(display.getPixelData())
}, 1000 / FPS)


