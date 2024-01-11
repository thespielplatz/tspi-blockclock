const ScreenPrototype = require('../lib/StateMachine/AbstractState.js')

class StartupScreen extends ScreenPrototype {
  onEnter(options) {
    this.display.fill(0x000000)
    this.display.setColors(0xFFFFFF)
    if (this.is25x10) {
      this.display.writeLine('strt', 1, 3, true)
    } else {
      this.display.writeLine('startup', 5, 1, true)
    }
  }

  onMessage(options) {
    if (options.message === 'error') {
      this.display.fill(0xA00000)
      this.display.setColors(0xFFFFFF)
      this.display.writeLine(options.text + ' :(', 1, 0)
    }
  }
}

module.exports = StartupScreen
