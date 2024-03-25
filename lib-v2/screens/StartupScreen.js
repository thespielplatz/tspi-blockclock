const AbstractScreen = require('../screenManager/AbstractScreen.js')

class StartupScreen extends AbstractScreen {
  enter(options = {}) {
    super.enter(options)

    this.displayRenderer.fill(0x000000)
    this.displayRenderer.setColors(0xFFFFFF)
    this.displayRenderer.resetCursor()
    const message = options.message != null ? options.message : 'startup'
    this.displayRenderer.writeLine(message)
  }
}

module.exports = StartupScreen
