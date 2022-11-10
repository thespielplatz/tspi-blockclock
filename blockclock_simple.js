console.info('Blockclock Starting ...')

require('dotenv').config()
const WS281xRenderer = require('./lib/WS281xRenderer.js')
const display = require('./lib/display.js')

const rainbow = require('./blockclock/rainbow.js')
const blocktime = require('./blockclock/blocktime.js')
const movingblock = require('./blockclock/movingblock.js')

const FPS = process.env.DISPLAY_FPS || 60
const WIDTH = process.env.DISPLAY_WIDTH || 50
const HEIGHT = process.env.DISPLAY_HEIGHT || 5
const BRIGHTNESS = process.env.DISPLAY_BRIGHTNESS || 50
const NUM_LEDS = WIDTH * HEIGHT

const renderer = new WS281xRenderer(NUM_LEDS, BRIGHTNESS, WIDTH)
renderer.init()

display.init(WIDTH, HEIGHT)
display.setColors(0xFFFFFF, display.NOT_SET)

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
