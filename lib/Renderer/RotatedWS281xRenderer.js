const WS281xRenderer = require('./WS281xRenderer')

class RotatedWS281xRenderer extends WS281xRenderer {
  constructor({ numLeds, brightness, width, revertedRows }, architecture) {
    super({ numLeds, brightness, width, revertedRows }, architecture)
  }

  render(colors) {
    super.render(colors.reverse())
  }
}

module.exports = RotatedWS281xRenderer
