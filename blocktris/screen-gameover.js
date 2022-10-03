const Screen = require('./screen-prototype.js')

class GameOverScreen extends Screen {
  onEnter() {
    this.display.fill(0x000000)
    this.display.setColors(0xFFFFFF)
    this.display.writeLine('startup', 5, 1, true)
  }
}

module.exports = GameOverScreen
