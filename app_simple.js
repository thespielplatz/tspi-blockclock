console.info('Blockclock Starting ...')

require('dotenv').config()
const RendererFactory = require('./lib/Renderer/RendererFactory.js')

const rainbow = require('./animations/rainbow.js')
const blocktime = require('./simple/blocktime.js')
const movingblock = require('./animations/movingblock.js')
const PixelDisplay = require('./lib/PixelDisplay')

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

rainbow.init(NUM_LEDS, 1.0)

setInterval(function () {
  rainbow.nextStep(display)
  movingblock.render(display)
  blocktime.render(display)

  renderer.render(display.getPixelData())
}, 1000 / FPS)

blocktime.start()

blocktime.setNewBlockStartCallback(() => {
  rainbow.setBrightness(0.8)
})

blocktime.setNewBlockEndCallback(() => {
  rainbow.setBrightness(0)

  movingblock.start(WIDTH, HEIGHT, 0, 12)

  movingblock.setFinishedCallback(() => {
    //rainbow.fadeOn()
  })
})
