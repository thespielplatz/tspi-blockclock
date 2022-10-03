const Screen = require('./screen-prototype.js')

class GameOverScreen extends Screen {
  static NAME = 'STATE_GAME_OVER'

  constructor(sm, display, sg) {
    super(sm, display)

    this.sg = sg
  }

  onEnter(options) {
    this.display.fill(0x000000)
    this.display.setColors(0xFFFFFF)
    this.display.writeLine('Game over', 1, 1, true)
  }
}

module.exports = GameOverScreen
