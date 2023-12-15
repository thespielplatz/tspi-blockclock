const ScreenPrototype = require('../lib/StateMachine/ScreenPrototype.js')
const { renderLAB10Logo, SateLogo } = require("../lib/drawings")

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

    // TODO: Make seconds configureable
    //const timeAsText = `${hours}:${min}:${sec}`
    const timeAsText = `${hours}:${min}`
    // NUM_OF_CHARS * CHAR_WIDTH - (shorter '1') + ':' + Spacings
    const textWidth = 2 * 3 - (timeAsText.split("1").length - 1) + 1 + (timeAsText.length - 1)

    this.offset = Math.floor((this.display.getWidth() - textWidth) / 2)

    this.text = timeAsText
  }

  onRender(fps) {
    this.display.setColors(0xFFFFFF)
    this.display.writeLine(this.text, this.offset)

    renderLAB10Logo(this.display,2)
    SateLogo(this.display, 42)
  }
}

module.exports = ScreenTime
