let offset = 0
let floatOffset = 0
let NUM_LEDS = 10
let brightnessFactor = 1.0
let speed = 0.5

function init(numLeds, factor = 1.0) {
  NUM_LEDS = numLeds
  brightnessFactor = factor
}

function setBrightness(factor) {
  brightnessFactor = factor
}

function fadeOn() {
  if (brightnessFactor >= 1.0) {
    brightnessFactor = 1.0
    return
  }
  brightnessFactor += 0.025
  setTimeout(fadeOn, 25)
}

function rgb2Int(r, g, b) {
  r = Math.floor(r * brightnessFactor)
  g = Math.floor(g * brightnessFactor)
  b = Math.floor(b * brightnessFactor)
  return ((r & 0xff) << 16) + ((g & 0xff) << 8) + (b & 0xff);
}

function colorwheel(pos) {
  pos = 255 - pos;
  if (pos < 85) { return rgb2Int(255 - pos * 3, 0, pos * 3); }
  else if (pos < 170) { pos -= 85; return rgb2Int(0, pos * 3, 255 - pos * 3); }
  else { pos -= 170; return rgb2Int(pos * 3, 255 - pos * 3, 0); }
}

function nextStep(display) {
  let pixelData = display.getPixelData()
  for (let i = 0; i < NUM_LEDS; i++) {
    pixelData[i] = colorwheel((offset + i) % 256);
  }
  //pixelData[offset] = 0xFFFFFF
  floatOffset += speed
  offset = Math.floor(floatOffset) % 256;
}

module.exports = {
  nextStep,
  init,
  setBrightness,
  fadeOn
}
