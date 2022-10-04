const Screen = require('./screen-prototype.js')

class GameOverScreen extends Screen {
  constructor(sm, display, sg) {
    super(sm, display)

    this.sg = sg
  }

  onEnter(options) {
    console.info('enter game over')
    this.display.fill(0x000000)
    this.display.setColors(0xFFFFFF)
    this.display.writeLine('ga', 1, 1, true)
    this.display.writeChar(13, 0, 'm', true)
    this.display.writeLine('eover', 19, 1, true)

    setTimeout(this.gotoNextScreen.bind(this), 1000)
  }

  gotoNextScreen() {
    this.sm.switchTo(Screen.READY)
  }
}

module.exports = GameOverScreen
