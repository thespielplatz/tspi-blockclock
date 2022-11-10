const ScreenPrototype = require('../lib/StateMachine/ScreenPrototype.js')

class ScreenEmpty extends ScreenPrototype {
  static NAME = 'SCREEN_EMPTY'

  onEnter(options) {
  }
}

module.exports = ScreenEmpty
