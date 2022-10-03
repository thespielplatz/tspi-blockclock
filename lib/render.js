const ws281x = require('rpi-ws281x-native')
const BLACK = 0x000000

let NUM_LEDS = 0, BRIGHTNESS = 50, WIDTH = 50
let pixelData = []

const init = (numLeds, brightness, width) => {
  console.info('WS281 init')
  NUM_LEDS = numLeds
  BRIGHTNESS = brightness
  WIDTH = width

  ws281x.init(NUM_LEDS)
  pixelData = new Uint32Array(NUM_LEDS)

  if (BRIGHTNESS > 168) {
    BRIGHTNESS = 168
    console.warn(`Reduced Brightness to ${BRIGHTNESS}`)
  }
  ws281x.setBrightness(brightness) // below 60%
}

const deinit = () => {
  console.log('Resetting WS281x')
  ws281x.reset()
}

const render = (colors) => {
  for (let i = 0; i < NUM_LEDS; i++) {
    if (i < colors.length) {
      pixelData[i] = ((0xFF0000 & colors[i]) >> 8) + ((0xFF00 & colors[i]) << 8) + (0xFF & colors[i])
    } else {
      pixelData[i] = BLACK
    }
  }

  let lines = [];
  for (let i = 0; i < pixelData.length; i += WIDTH) {
    const line = pixelData.slice(i, i + WIDTH)
    lines.push(line);
  }

  lines[1] = lines[1].reverse()
  lines[3] = lines[3].reverse()

  pixelData = [].concat(lines[0], lines[1], lines[2], lines[3], lines[4])

  ws281x.render(pixelData)
}

module.exports = {
  init,
  deinit,
  render,
}
