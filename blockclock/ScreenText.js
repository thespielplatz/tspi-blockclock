const ScreenPrototype = require('../lib/StateMachine/AbstractState.js')

class ScreenText extends ScreenPrototype {
  static NAME = 'SCREEN_TEXT'

  constructor(statemachine, display) {
    super(statemachine, display)
  }

  onEnter(options) {
    this.text = 'no text'
    if (options && ('text' in options)) this.text = options.text
  }

  onRender(fps) {
    this.display.fill(0)
    this.display.setColors(0xFFFFFF)
    this.display.writeLine(this.text, 1)
  }
}

module.exports = ScreenText
