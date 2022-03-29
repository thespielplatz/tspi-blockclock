const ws281x = require('rpi-ws281x-native')
const BLACK = 0x000000

let NUM_LEDS = 0, BRIGHTNESS = 50

const init = (numLeds, brightness) => {
  NUM_LEDS = numLeds
  BRIGHTNESS = brightness

  ws281x.init(NUM_LEDS)

  if (BRIGHTNESS > 128) {
    BRIGHTNESS = 128
    console.warn(`Reduced Brightness to ${BRIGHTNESS}`)
  }
  ws281x.setBrightness(brightness) // below 60%
}

const deinit = () => {
  console.log('Resetting WS281x')
  ws281x.reset()
}

const render = (colors) => {
  var output = []
  for (let i = 0; i < NUM_LEDS; i++) {
    if (i < colors.length) {
      output[i] = colors[i]
    } else {
      output[i] = BLACK
    }
  }
  ws281x.render(output)
}

const testRunner = () => {
  const pause = () => new Promise(res => setTimeout(res, 5));

  let colors = [...Array(50 * 5 - 1)].map((v) => 0x600000)
  colors.push(0xFFFFFF)
  let count = 0;

  (async function() {
    while(true) {
      var tmp = []
      for (let i = 0 ;i < NUM_LEDS; i++) {
        if (i > NUM_LEDS) break
        tmp[i] = colors[(count + i) % colors.length]
      }
      ws281x.render(tmp)
      count++
      await pause()
    }
  })()
}

module.exports = {
  init,
  deinit,
  render,
  testRunner
}
