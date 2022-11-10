const ScreenPrototype = require('../lib/StateMachine/ScreenPrototype.js')

class ScreenClock extends ScreenPrototype {
  static NAME = 'SCREEN_CLOCK'

  constructor(statemachine, display) {
    super(statemachine, display)

    this.blocktime = ''
  }

  onEnter(options) {
    this.renderTime()
  }

  renderTime() {
    this.display.fill(0x000000)
    this.display.setColors(0xFFFFFF)

    const blockAsText = this.blocktime.toString()
    const charWidths = blockAsText.length * 3 - (blockAsText.split('1').length - 1)
    const spacings = (blockAsText.length - 1)
    const offset = Math.floor((this.display.getWidth() - charWidths - spacings) / 2)
    this.display.writeLine(this.blocktime, offset)
  }

  onMessage(options) {
    if (options.message == 'newblock') {
      this.blocktime = options.blocktime
      this.renderTime()
    }

    if (options.message == 'error') {
      this.display.fill(0xA00000)
      this.display.setColors(0xFFFFFF)
      this.display.writeLine(options.text + ' :(', 1, 0)
    }
  }
}

module.exports = ScreenClock
