const ScreenPrototype = require('../lib/StateMachine/AbstractState.js')

class ScreenClock extends ScreenPrototype {
  static NAME = 'SCREEN_CLOCK'

  constructor(statemachine, display) {
    super(statemachine, display)

    this.blocktime = '1'
    this.offset = 0
  }

  onEnter(options) {
    if (options && ('blocktime' in options)) this.blocktime = options.blocktime
    this.renderTime()
  }

  renderTime() {
    const blockAsText = this.blocktime.toString()
    const charWidths = blockAsText.length * 3 - (blockAsText.split('1').length - 1)
    const spacings = (blockAsText.length - 1)
    this.offset = Math.floor((this.display.getWidth() - charWidths - spacings) / 2)
  }

  onRender(fps) {
    this.display.setColors(0xFFFFFF)
    this.display.writeLine(this.blocktime, this.offset)
  }

  onMessage(options) {
    if (options.message === 'blocktime') {
      this.blocktime = options.blocktime
      this.renderTime()
    }

    if (options.message === 'error') {
      this.display.fill(0xA00000)
      this.display.setColors(0xFFFFFF)
      this.display.writeLine(options.text + ' :(', 1, 0)
    }
  }
}

module.exports = ScreenClock
