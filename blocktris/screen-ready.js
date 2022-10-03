const Screen = require('./screen-prototype.js')
const Game = require('./screen-game.js')

class ReadyScreen extends Screen {
  static NAME = 'STATE_READY'

  constructor(sm, display, sg) {
    super(sm, display)

    this.sg = sg

    sg.on('play', this.onReadyMessage.bind(this))
  }

  onReadyMessage({ key, name }, controllerId) {
    if (!this.isActive) return

    this.sg.emit('start', null, controllerId)

    this.sm.switchTo(Game.NAME, { controllerId, key, name })
  }

  onEnter(options) {
    this.display.fill(0x000000)
    this.display.setColors(0xFFFFFF)
    this.display.writeLine('Tetris', 7, 1, true)
  }
}

module.exports = ReadyScreen
