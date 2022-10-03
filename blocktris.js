console.info('Blocktris Starting ...')

require('dotenv').config()
const render = require('./lib/render.js')
const display = require('./lib/display.js')
const SocketGames = require('./lib/SocketGames.js')
const StateMachine = require('./blocktris/statemachine')
const Startup = require('./blocktris/screen-startup')
const Ready = require('./blocktris/screen-ready')
const Game = require('./blocktris/screen-game')
const GameOver = require('./blocktris/screen-gameover')

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
/*
const socketGames = new SocketGames({
  url: process.env.SOCKET_API,
  screenId: SCREEN_ID,
  onConnect: (data) => {
    if (data.screenId !== SCREEN_ID) {
      console.error('wrong screenId sent from BE!')
      sm.switchTo(Startup.NAME)
      sm.sendMessage({ message: 'error', text: 'S:screen id'})
      return
    }

    //sm.switchTo(Ready.NAME)
  },
  onError: (error) => {
    console.error('SocketGames: onError', { error })
      sm.switchTo(Startup.NAME)
    sm.sendMessage({ message: 'error', text: 'S:error'})
  },
})
*/

const socketGames = { on: () => {}, emit: () => {} }
// ------------ Main State Machine

sm = new StateMachine.StateMachine()
sm.addScreen(Startup.NAME, new Startup(this, display))
sm.addScreen(Ready.NAME, new Ready(this, display, socketGames))
sm.addScreen(Game.NAME, new Game(this, display, socketGames))
sm.addScreen(GameOver.NAME, new GameOver(this, display, socketGames))

sm.switchTo(Startup.NAME)
setTimeout(() => {
  sm.switchTo(Game.NAME)
}, 1000)

setInterval(function () {
  sm.onRender(FPS)
  render.render(display.getPixelData())
}, 1000 / FPS)


