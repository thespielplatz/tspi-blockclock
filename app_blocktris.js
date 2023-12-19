console.info('Blocktris Starting ...')

require('dotenv').config()
const RendererFactory = require('./lib/Renderer/RendererFactory.js')
const SocketGames = require('./blocktris/SocketGames.js')
const StateMachine = require('./lib/StateMachine/StateMachine')
const Screen = require('./blocktris/screen')

const Startup = require('./blocktris/screen-startup')
const Ready = require('./blocktris/screen-ready')
const Game = require('./blocktris/screen-game')
const GameOver = require('./blocktris/screen-gameover')
const PixelDisplay = require('./lib/PixelDisplay')

const FPS = parseInt(process.env.DISPLAY_FPS) || 60
const WIDTH = parseInt(process.env.DISPLAY_WIDTH) || 50
const HEIGHT = parseInt(process.env.DISPLAY_HEIGHT) || 5
const BRIGHTNESS = parseInt(process.env.DISPLAY_BRIGHTNESS) || 50
const REVERTED_ROWS = process.env.DISPLAY_REVERTED_ROWS || ''
const NUM_LEDS = WIDTH * HEIGHT

// ------------ Renderer and Display

const renderer = RendererFactory.getRenderer({
  numLeds: NUM_LEDS,
  brightness: BRIGHTNESS,
  width: WIDTH,
  revertedRows: REVERTED_ROWS,
})
renderer.init()

const display = new PixelDisplay(WIDTH, HEIGHT)
display.setColors(0xFFFFFF, PixelDisplay.NOT_SET)

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


