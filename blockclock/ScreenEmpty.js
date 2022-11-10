const ScreenPrototype = require('../lib/StateMachine/ScreenPrototype.js')

class ScreenEmpty extends ScreenPrototype {
  static NAME = 'SCREEN_EMPTY'

  onEnter(options) {
    this.display.fill(0x000000)
    this.display.setColors(0xFFFFFF)
  }
}

module.exports = ScreenEmpty
