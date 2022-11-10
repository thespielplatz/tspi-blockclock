const ScreenPrototype = require('../lib/StateMachine/ScreenPrototype.js')

const rainbow = require('../animations/rainbow')

const newBlockText = '!! new block !!'


class ScreenClock extends ScreenPrototype {
  static NAME = 'SCREEN_NEW_BLOCK'
  static MSG_FINISHED = 'ScreenClock|MSG_FINISHED'

  constructor(statemachine, display) {
    super(statemachine, display)

    this.text = newBlockText
    this.textColor = 0xFFFFFF

    rainbow.init(display.getWidth() * display.getHeight(), 0.5)
  }

  onEnter(options) {
    this.display.fill(0x000000)
    this.display.setColors(0xFFFFFF)

    this.startAnimation()
  }

  onRender(fps) {
    // Calculate Next Step and render
    rainbow.nextStep(this.display)

    this.display.setColors(this.textColor)
    this.display.writeLine(this.text, 1)
  }

  startAnimation() {
    const self = this
    const theMessage = ScreenClock.MSG_FINISHED

    this.textColor = 0xB0B0B0

    setTimeout(() => { self.textColor = 0xFFFFFF }, 300)
    setTimeout(() => { self.textColor = 0xB0B0B0 }, 600)
    setTimeout(() => { self.textColor = 0xFFFFFF }, 900)
    setTimeout(() => { self.textColor = 0xB0B0B0 }, 1200)
    setTimeout(() => { self.textColor = 0xFFFFFF }, 1500)
    setTimeout(() => { self.textColor = 0xB0B0B0 }, 1800)
    setTimeout(() => { self.textColor = 0xFFFFFF }, 2100)
    setTimeout(() => { self.textColor = 0xB0B0B0 }, 2400)
    setTimeout(() => { self.textColor = 0xFFFFFF }, 2700)
    setTimeout(() => {
      const options = { message: theMessage }
      self.sm.sendMessage(options)
    }, 6000)
  }


}

module.exports = ScreenClock
