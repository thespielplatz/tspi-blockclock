console.info('Blockclock Starting ...')
require('dotenv').config()

const WS281xRenderer = require('./lib/WS281xRenderer.js')
const PixelDisplay = require('./lib/PixelDisplay')

const Blocktime = require('./blockclock/BlockTime.js')

const StateMachine = require('./lib/StateMachine/StateMachine')
const ScreenEmpty = require('./blockclock/ScreenEmpty')
const ScreenClock = require('./blockclock/ScreenClock')
const ScreenNewBlock = require('./blockclock/ScreenNewBlock')
const ScreenText = require('./blockclock/ScreenText')

const Frontend = require('./blockclock/Frontend')
const Movingblock = require('./animations/movingblock.js')

const FPS = process.env.DISPLAY_FPS || 60
const WIDTH = process.env.DISPLAY_WIDTH || 50
const HEIGHT = process.env.DISPLAY_HEIGHT || 5
const BRIGHTNESS = process.env.DISPLAY_BRIGHTNESS || 50
const REVERTED_ROWS = process.env.DISPLAY_REVERTED_ROWS || '1,3'
const NUM_LEDS = WIDTH * HEIGHT

const renderer = new WS281xRenderer(NUM_LEDS, BRIGHTNESS, WIDTH, REVERTED_ROWS)
renderer.init()

const display = new PixelDisplay(WIDTH, HEIGHT)
display.setColors(0xFFFFFF, PixelDisplay.NOT_SET)

// ------------ Data

let state = {
  'running': true,
  'blocktime': 0,
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

  if (sm.getScreenName() !== ScreenClock.NAME) {
    sm.sendMessage({ 'message' : 'blocktime', 'blocktime': state.blocktime })
    return
  }

  if (state.newblock.rainbow) {
    movingblock = null
    sm.switchTo(ScreenNewBlock.NAME)
    return
  }

  if (sm.getScreenName() === ScreenClock.NAME) {
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

// ------------ Frontend

const frontend = new Frontend()
frontend.setActionCallback((data) => {
  switch (data.action) {
    case 'turnoff':
      state.running = false
      sm.switchTo(ScreenEmpty.NAME)
      break;

    case 'turnon':
      state.running = true
      sm.switchTo(ScreenClock.NAME, { 'blocktime': state.blocktime })
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
        sm.switchTo(ScreenClock.NAME, { 'blocktime': state.blocktime })
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

/*

const TRANSACTION_MAX = HEIGHT * HEIGHT
const Transactionblock = require('./blockclock/transactionblock.js')

const blocktime = new Blocktime()
let blocks = []
blocks.push(new Transactionblock(HEIGHT))
blocks[0].x = 26
blocks.push(new Transactionblock(HEIGHT, true))
blocks[1].x = blocks[0].x + 9
blocks.push(new Transactionblock(HEIGHT, true))
blocks[2].x = blocks[1].x + 6
blocks.push(new Transactionblock(HEIGHT, true))
blocks[3].x = blocks[2].x + 6

setInterval(function () {
  display.fill(0)
  display.writeLine(blocktime.blocktime.toString(), 1)

  display.setPixel(33, 0, 0xFF8800)
  display.setPixel(33, 2, 0xFF8800)
  display.setPixel(33, 4, 0xFF8800)

  for (let i = 0; i < blocks.length; i++) {
    blocks[i].update(1 / FPS)
    blocks[i].render(display)
  }

  renderer.render(display.getPixelData())
}, 1000 / FPS)


blocktime.start()

blocktime.setNewBlockCallback((blocktime) => {
})

blocktime.setVsizeChangedCallback((vsize) => {
  let newSize = Math.min(TRANSACTION_MAX, 1 + Math.floor(TRANSACTION_MAX * vsize / (1024 * 1024)))
  blocks[0].setTransactions(newSize)
})

*/
