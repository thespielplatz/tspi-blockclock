const Screen = require('./screen-prototype.js')

class StartupScreen extends Screen {
  onEnter(options) {
    this.display.fill(0x000000)
    this.display.setColors(0xFFFFFF)
    this.display.writeLine('startup', 5, 1, true)
  }

  onMessage(options) {
    if (options.message = 'error') {
      this.display.fill(0xA00000)
      this.display.setColors(0xFFFFFF)
      this.display.writeLine(options.text + ' :(', 1, 0)
    }
  }
}

module.exports = StartupScreen
