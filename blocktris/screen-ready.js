const Screen = require('./screen-prototype.js')

class StartupScreen extends Screen {
  constructor(sm, display, sg) {
    super(sm, display)

    this.sg = sg

    // Todo: get clientId
    sg.on('ready', this.onReadyMessage.bind(this))
  }

  onReadyMessage(data) {
    if (!this.isActive) return

    this.sg.emit('start')

    this.sm.switchTo(sm.STATE_GAME)
  }

  onEnter() {
    this.display.fill(0x000000)
    this.display.setColors(0xFFFFFF)
    this.display.writeLine('Tetris', 7, 1, true)
  }
}

module.exports = StartupScreen
