console.info('Blocktris Starting ...')

require('dotenv').config()
const WS281xRenderer = require('./lib/WS281xRenderer.js')
const display = require('./lib/display.js')
const SocketGames = require('./lib/SocketGames.js')
const StateMachine = require('./blocktris/statemachine')
const Screen = require('./blocktris/screen-prototype.js')
const Startup = require('./blocktris/screen-startup')
const Ready = require('./blocktris/screen-ready')
const Game = require('./blocktris/screen-game')
const GameOver = require('./blocktris/screen-gameover')

const FPS = process.env.DISPLAY_FPS || 60
const WIDTH = process.env.DISPLAY_WIDTH || 50
const HEIGHT = process.env.DISPLAY_HEIGHT || 5
const BRIGHTNESS = process.env.DISPLAY_BRIGHTNESS || 50
const NUM_LEDS = WIDTH * HEIGHT

// ------------ Renderer and Display

const renderer = new WS281xRenderer(NUM_LEDS, BRIGHTNESS, WIDTH)
renderer.init()

display.init(WIDTH, HEIGHT)
display.setColors(0xFf0000, display.NOT_SET)

// ------------ socket.games connection
const SCREEN_ID = process.env.SCREEN_ID || 'tspi-blockclock'
const socketGames = new SocketGames({
  url: process.env.SOCKET_API,
  screenId: SCREEN_ID,
  onConnect: (data) => {
    if (data.screenId !== SCREEN_ID) {
      console.error('wrong screenId sent from BE!')
      sm.switchTo(Screen.STARTUP)
      sm.sendMessage({ message: 'error', text: 'S:screen id'})
      return
    }

    sm.switchTo(Screen.READY)
  },
  onError: (error) => {
    console.error('SocketGames: onError', { error })
    sm.switchTo(Screen.STARTUP)
    sm.sendMessage({ message: 'error', text: 'S:error'})
  },
})

// ------------ Main State Machine

sm = new StateMachine.StateMachine()
sm.addScreen(Screen.STARTUP, new Startup(sm, display))
sm.addScreen(Screen.READY, new Ready(sm, display, socketGames))
sm.addScreen(Screen.GAME, new Game(sm, display, socketGames))
sm.addScreen(Screen.GAME_OVER, new GameOver(sm, display, socketGames))

sm.switchTo(Screen.STARTUP)
//setTimeout(() => { sm.switchTo(Screen.GAME)}, 1000)

let inFrame = false
setInterval(function () {
  if (inFrame) {
    console.log('Frameskip')
    return
  }
  inFrame = true
  sm.onRender(FPS)
  renderer.render(display.getPixelData())
  inFrame = false
}, 1000 / FPS)


