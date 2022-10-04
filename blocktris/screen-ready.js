const Screen = require('./screen-prototype.js')

class ReadyScreen extends Screen {
  constructor(sm, display, sg) {
    super(sm, display)

    this.sg = sg

    sg.on('play', this.onReadyMessage.bind(this))
  }

  onReadyMessage({ key, name }, controllerId) {
    if (!this.isActive) return

    this.sg.emit('start', null, controllerId)

    this.sm.switchTo(Screen.GAME, { controllerId, key, name })
  }

  onEnter(options) {
    this.display.fill(0x000000)
    this.display.setColors(0xFFFFFF)
    this.display.writeLine('Tetris', 7, 1, true)
  }
}

module.exports = ReadyScreen
