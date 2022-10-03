const ws281x = require('rpi-ws281x-native')
const Jetty = require("jetty")

const BLACK = 0x000000

let NUM_LEDS = 0, BRIGHTNESS = 50, WIDTH = 50
let pixelData = []
let isStub = undefined


const init = (numLeds, brightness, width) => {
  console.info('WS281 init')
  NUM_LEDS = numLeds
  BRIGHTNESS = brightness
  WIDTH = width

  ws281x.init(NUM_LEDS, {})
  isStub = ws281x.isStub()

  if (isStub) {
    jetty = new Jetty(process.stdout)
    jetty.reset().clear().moveTo([0,0])
  }

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
  if (isStub) {
    renderToConsole(colors)
    return
  }

  // Translate Colors
  for (let i = 0; i < NUM_LEDS; i++) {
    if (i < colors.length) {
      pixelData[i] = ((0xFF0000 & colors[i]) >> 8) + ((0xFF00 & colors[i]) << 8) + (0xFF & colors[i])
    } else {
      pixelData[i] = BLACK
    }
  }

  // Hardcoded hardware line reverse
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

const renderToConsole = (pixelData) => {

  for (let i = 0; i < pixelData.length; i++) {
    const x = i % WIDTH * 3
    const y = Math.floor(i / WIDTH)
    const r = Math.floor(((0xFF0000 & pixelData[i]) >> 16) / 255 * 5)
    const g = Math.floor(((0xFF00 & pixelData[i]) >> 8) / 255 * 5)
    const b = Math.floor(((0xFF & pixelData[i])) / 255 * 5)

    jetty.moveTo([y, x]).rgb([r,g,b]).text('## ')
  }
}

module.exports = {
  init,
  deinit,
  render,
}
