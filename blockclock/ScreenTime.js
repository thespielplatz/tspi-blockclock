const ScreenPrototype = require('../lib/StateMachine/ScreenPrototype.js')

class ScreenTime extends ScreenPrototype {
  static NAME = 'SCREEN_TIME'

  constructor(statemachine, display) {
    super(statemachine, display)

    this.text = ""
    this.offset = 0
    this.intervalId = null
  }

  onEnter(options) {
    this.renderTime()

    this.intervalId = setInterval(this.renderTime.bind(this), 1000)
  }

  onLeave() {
    if (this.intervalId !== null) clearInterval(this.intervalId)
    this.intervalId = null
  }

  renderTime() {
    let date = new Date()

    const hours = ("0" + date.getHours()).slice(-2)
    const min = ("0" + date.getMinutes()).slice(-2)
    const sec = ("0" + date.getSeconds()).slice(-2)

    const timeAsText = `${hours}:${min}:${sec}`
    const charWidths = timeAsText.length * 3 - (timeAsText.split('1').length - 1)
    const spacings = (timeAsText.length - 1) - 2 // subtract 2 for ':'

    this.offset = Math.floor((this.display.getWidth() - charWidths - spacings) / 2)
    this.text = timeAsText
  }

  onRender(fps) {
    this.display.setColors(0xFFFFFF)
    this.display.writeLine(this.text, this.offset)
  }
}

module.exports = ScreenTime
