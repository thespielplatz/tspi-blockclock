const ScreenPrototype = require('../../lib/StateMachine/AbstractState.js')

const Screen = require('../ScreenStates.js')

class GameOverScreen extends ScreenPrototype {
  constructor(sm, display, sg) {
    super(sm, display)

    this.sg = sg
  }

  onEnter() {
    console.info('enter game over')
    this.display.fill(0x000000)
    this.display.setColors(0xFFFFFF)
    if (this.is25x10) {
      this.display.writeChar(0, 1, 'g', true)
      this.display.writeChar(0, 5, 'a', true)
      this.display.writeChar(6, 1, 'm', true)
      this.display.writeChar(6, 5, 'e', true)
      this.display.writeChar(14, 1, 'o', true)
      this.display.writeChar(14, 5, 'v', true)
      this.display.writeChar(20, 1, 'e', true)
      this.display.writeChar(20, 5, 'r', true)
    } else {
      this.display.writeLine('ga', 1, 1, true)
      this.display.writeChar(13, 0, 'm', true)
      this.display.writeLine('eover', 19, 1, true)
    }

    setTimeout(this.gotoNextScreen.bind(this), 2000)
  }

  gotoNextScreen() {
    this.sm.switchTo(Screen.READY)
  }
}

module.exports = GameOverScreen
