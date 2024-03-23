console.info('Blocktris starting ...')

require('dotenv').config()
const RendererFactory = require('./lib/Renderer/RendererFactory.js')
const StateMachine = require('./lib/StateMachine/StateMachine')
const PixelDisplay = require('./lib/PixelDisplay')

const Startup = require('./blocktris/screens/StartupScreen.js')
const Ready = require('./blocktris/screens/ReadyScreen.js')
const ReadyClock = require('./blocktris/screens/ReadyClockScreen.js')
const Game = require('./blocktris/screens/GameScreen.js')
const GameOver = require('./blocktris/screens/GameOverScreen.js')
const ScreenStates = require('./blocktris/ScreenStates.js')
const SocketGames = require('./blocktris/SocketGames.js')

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
console.info('- renderer initialized')

const display = new PixelDisplay(WIDTH, HEIGHT)
display.setColors(0xFFFFFF, PixelDisplay.NOT_SET)
console.info('- display initialized')

// ------------ socket.games connection
const SCREEN_ID = process.env.BLOCKTRIS_SCREEN_ID || 'tspi-blockclock'
const socketGames = new SocketGames({
  url: process.env.BLOCKTRIS_SOCKET_API,
  screenId: SCREEN_ID,
  onConnect: (data) => {
    if (data.screenId !== SCREEN_ID) {
      console.error('wrong screenId sent from BE!')
      stateMachine.switchTo(ScreenStates.STARTUP)
      stateMachine.sendMessage({ message: 'error', text: 'S:screen id'})
      return
    }

    stateMachine.switchTo(ScreenStates.READY)
  },
  onError: (error) => {
    console.error('SocketGames: onError', { error })
    stateMachine.switchTo(ScreenStates.STARTUP)
    stateMachine.sendMessage({ message: 'error', text: 'S:error'})
  },
})
console.info('- socket connection initialized')

// ------------ Main State Machine
const stateMachine = new StateMachine.StateMachine()
stateMachine.addScreen(ScreenStates.STARTUP, new Startup(stateMachine, display))
stateMachine.addScreen(ScreenStates.READY, new Ready(stateMachine, display, socketGames))
stateMachine.addScreen(ScreenStates.READY_CLOCK, new ReadyClock(stateMachine, display, socketGames))
stateMachine.addScreen(ScreenStates.GAME, new Game(stateMachine, display, socketGames))
stateMachine.addScreen(ScreenStates.GAME_OVER, new GameOver(stateMachine, display, socketGames))
stateMachine.switchTo(ScreenStates.STARTUP)

let inFrame = false
const renderFrame = () => {
  setTimeout(renderFrame, 1000 / FPS)
  if (inFrame) {
    console.info('⚠️ frameskip ⚠️')
    return
  }
  inFrame = true
  stateMachine.onRender(FPS)
  renderer.render(display.getPixelData())
  inFrame = false
}
renderFrame()
console.info('Blocktris started')
