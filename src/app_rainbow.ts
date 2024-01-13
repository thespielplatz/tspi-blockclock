const ws281x_arm7 = require('rpi-ws281x-native')

import getConfig from './lib/configParser'

console.info('Just Rendering a rainbow ...')

const CONFIG = getConfig()

const appArgs = process.argv.slice(2)
if (appArgs.length <= 0) {
  console.info('Argument needed: <num_of_pixel as int>')

  process.exit(0)
}

const NUM_LEDS = parseInt(process.argv[2], 10) || 10

const channel = ws281x_arm7(NUM_LEDS, {
  brightness: CONFIG.WS281X.brightness,
  stripType: 'ws2812'
})
const pixelData = channel.array

// ---- trap the SIGINT and reset before exit
process.on('SIGINT', function () {
  ws281x_arm7.reset()
  ws281x_arm7.finalize()
  process.nextTick(function () { process.exit(0); })
})


let offset = 0
setInterval(function () {
  for (let i = 0; i < NUM_LEDS; i++) {
    pixelData[i] = colorwheel((offset + i) % 256)
  }

  offset = (offset + 1) % 256
  ws281x_arm7.render()
}, 1000 / 30)

console.log('Press <ctrl>+C to exit.')


// rainbow-colors, taken from http://goo.gl/Cs3H0v
function colorwheel(index: number) {
  index = 255 - index;
  if (index < 85) {
    return rgb2Int(255 - index * 3, 0, index * 3)
  } else if (index < 170) {
    index -= 85
    return rgb2Int(0, index * 3, 255 - index * 3)
  } else {
    index -= 170
    return rgb2Int(index * 3, 255 - index * 3, 0)
  }
}

function rgb2Int(red: number, green: number, blue: number) {
  return ((red & 0xff) << 16) + ((green & 0xff) << 8) + (blue & 0xff)
}
