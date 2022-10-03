const Screen = require('./screen-prototype.js')
const StateMachine = require('./statemachine.js')

class ReadyScreen extends Screen {
  static NAME = 'STATE_READY'

  constructor(sm, display, sg) {
    super(sm, display)

    this.sg = sg

    // Todo: get clientId
    sg.on('ready', this.onReadyMessage.bind(this))
  }

  onReadyMessage(data) {
    if (!this.isActive) return

    this.sg.emit('start')

    this.sm.switchTo(StateMachine.STATE_GAME, { playerId : ''})
  }

  onEnter(options) {
    this.display.fill(0x000000)
    this.display.setColors(0xFFFFFF)
    this.display.writeLine('Tetris', 7, 1, true)
  }
}

module.exports = ReadyScreen
