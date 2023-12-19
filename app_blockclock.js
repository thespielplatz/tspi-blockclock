console.info('Blockclock Starting ...')
require('dotenv').config()

const RendererFactory = require('./lib/Renderer/RendererFactory.js')
const PixelDisplay = require('./lib/PixelDisplay')

const Blocktime = require('./blockclock/BlockTime.js')

const StateMachine = require('./lib/StateMachine/StateMachine')
const ScreenEmpty = require('./blockclock/ScreenEmpty')
const ScreenClock = require('./blockclock/ScreenClock')
const ScreenNewBlock = require('./blockclock/ScreenNewBlock')
const ScreenText = require('./blockclock/ScreenText')
const ScreenTime = require('./blockclock/ScreenTime')

const Frontend = require('./blockclock/Frontend')
const Movingblock = require('./animations/movingblock.js')

const FPS = parseInt(process.env.DISPLAY_FPS) || 60
const WIDTH = parseInt(process.env.DISPLAY_WIDTH) || 50
const HEIGHT = parseInt(process.env.DISPLAY_HEIGHT) || 5
const BRIGHTNESS = parseInt(process.env.DISPLAY_BRIGHTNESS) || 50
const REVERTED_ROWS = process.env.DISPLAY_REVERTED_ROWS || ''
const NUM_LEDS = WIDTH * HEIGHT

const renderer = RendererFactory.getRenderer({
  numLeds: NUM_LEDS,
  brightness: BRIGHTNESS,
  width: WIDTH,
  revertedRows: REVERTED_ROWS,
})
renderer.init()

const display = new PixelDisplay(WIDTH, HEIGHT)
display.setColors(0xFFFFFF, PixelDisplay.NOT_SET)

// ------------ Data

let state = {
  'running': true,
  'blocktime': 0,
  'timemode' : 'block',
  'newblock': {
    'rainbow': true,
    'movingblock': true
  },
  'isshowingtext' : false
}

// ------------ Main State Machine

sm = new StateMachine.StateMachine()
const screenClock = new ScreenClock(sm, display)
sm.addScreen(ScreenClock.NAME, screenClock)
sm.addScreen(ScreenEmpty.NAME, new ScreenEmpty(sm, display))
sm.addScreen(ScreenNewBlock.NAME, new ScreenNewBlock(sm, display))
sm.addScreen(ScreenText.NAME, new ScreenText(sm, display))
sm.addScreen(ScreenTime.NAME, new ScreenTime(sm, display))

sm.switchTo(ScreenClock.NAME, { 'blocktime': state.blocktime })
//setTimeout(() => { sm.switchTo(ScreenNewBlock.NAME)}, 1000)

// ------------ Blockclock

sm.setOnMessageCallback((options) => {
  switch (options.message) {
    case ScreenNewBlock.MSG_FINISHED:
      if (sm.getScreenName() !== ScreenNewBlock.NAME) return

      sm.switchTo(ScreenClock.NAME, { 'blocktime': state.blocktime })
      if (state.newblock.movingblock) startMovingBlock()
      break;
  }
})

const blocktime = new Blocktime()
setTimeout(() => { blocktime.start() }, 1000)

blocktime.setNewBlockCallback((blocktime) => {
  state.blocktime = blocktime

  sm.sendMessage({ 'message' : 'blocktime', 'blocktime': state.blocktime })

  if (sm.getScreenName() === ScreenClock.NAME && state.newblock.rainbow) {
    movingblock = null
    sm.switchTo(ScreenNewBlock.NAME)
    return
  }

  if (sm.getScreenName() === ScreenClock.NAME && state.newblock.movingblock) {
    startMovingBlock()
  }

})

// ------------ Actions

let movingblock = null
function startMovingBlock() {
  if (movingblock !== null) return
  movingblock = Movingblock
  movingblock.start(WIDTH, HEIGHT, 0, 12)

  movingblock.setFinishedCallback(() => {
    movingblock = null
  })
}

function showDefault() {
  if (state.running === false) {
    sm.switchTo(ScreenEmpty.NAME)
    return
  }

  if (state.timemode === 'block') sm.switchTo(ScreenClock.NAME, { 'blocktime': state.blocktime })
  if (state.timemode === 'time') sm.switchTo(ScreenTime.NAME, {  })
}

// ------------ Frontend

const frontend = new Frontend()
frontend.setActionCallback((data) => {
  switch (data.action) {
    case 'turnoff':
      state.running = false
      showDefault()
      break;

    case 'turnon':
      state.running = true
      showDefault()
      break;

    case 'timemode-block':
      state.timemode = 'block'
      showDefault()
      break;

    case 'timemode-time':
      state.timemode = 'time'
      showDefault()
      break;

    case 'animation-off':
      state.newblock.rainbow = false
      state.newblock.movingblock = false
      break;

    case 'animation-rainbow':
      state.newblock.rainbow = !state.newblock.rainbow
      break;

    case 'animation-moving-block':
      state.newblock.movingblock = !state.newblock.movingblock
      break;

    case 'trigger-moving-block':
      startMovingBlock()
      break;

    case 'trigger-send-text':
      if (sm.getScreenName() !== ScreenText.NAME) {
        sm.switchTo(ScreenText.NAME, { 'text': data.text2display })
        state.isshowingtext = true
      } else {
        showDefault()
        state.isshowingtext = false
      }
      break;
  }

  let actives = []
  if (state.newblock.rainbow) actives.push('animation-rainbow')
  if (state.newblock.movingblock) actives.push('animation-moving-block')
  if (actives.length <= 0) actives.push('animation-off')

  actives.push(state.running ? 'turnon' : 'turnoff')

  if (state.isshowingtext) actives.push('trigger-send-text')
  if (state.timemode === 'block') actives.push('timemode-block')
  if (state.timemode === 'time') actives.push('timemode-time')

  return actives
})
frontend.start()

// ------------ Render Loop

let inFrame = false

setInterval(function () {
  if (inFrame) {
    console.log('Frameskip')
    return
  }
  inFrame = true
  display.fill(0x000000)
  display.setColors(0xFFFFFF)

  if (movingblock) movingblock.render(display)

  sm.onRender(FPS)

  renderer.render(display.getPixelData())
  inFrame = false
}, 1000 / FPS)