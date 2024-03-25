const AbstractScreen = require('../screenManager/AbstractScreen.js')

class ErrorScreen extends AbstractScreen {
  enter(options = {}) {
    super.enter(options)

    this.displayRenderer.fill(0xA00000)
    this.displayRenderer.setColors(0xFFFFFF)
    this.displayRenderer.resetCursor()
    const message = options.message != null ? options.message : 'error'
    this.displayRenderer.writeLine(message)
  }
}

module.exports = ErrorScreen
