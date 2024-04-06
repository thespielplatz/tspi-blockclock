const ReadyScreen = require('./ReadyScreen.js')
const PieceFallingAnimator = require('../tetris/PieceFallingAnimator.js')

const defaultOptions = {
  dropPieceAfterEveryMilliSeconds: 30000,
}

class ReadyClockScreen extends ReadyScreen {
  constructor(dependencies, options) {
    super(dependencies, options)
    const mergedOptions = {
      ...defaultOptions,
      ...options,
    }

    this.animator1 = new PieceFallingAnimator(dependencies, {
      width: this.displayWidth,
      height: this.displayHeight + 10,
      dropPieceAfterEveryMilliSeconds: mergedOptions.dropPieceAfterEveryMilliSeconds * 3,
    })
    this.animator2 = new PieceFallingAnimator(dependencies, {
      width: this.displayWidth,
      height: this.displayHeight + 10,
      dropPieceAfterEveryMilliSeconds: mergedOptions.dropPieceAfterEveryMilliSeconds * 3,
    })
    this.animator3 = new PieceFallingAnimator(dependencies, {
      width: this.displayWidth,
      height: this.displayHeight + 10,
      dropPieceAfterEveryMilliSeconds: mergedOptions.dropPieceAfterEveryMilliSeconds * 3,
    })
  }

  enter(options = {}) {
    super.enter(options)

    this._startAnimators()
  }

  render(updateDeltaInMillis) {
    // draw background
    this.displayRenderer.fill(0x000000)

    // draw tetris game in background
    this.animator1.update(updateDeltaInMillis)
    this.animator1.render((x, y, color) => this.displayRenderer.setPixel(x, y - 5, color))
    this.animator2.update(updateDeltaInMillis)
    this.animator2.render((x, y, color) => this.displayRenderer.setPixel(x, y - 5, color))
    this.animator3.update(updateDeltaInMillis)
    this.animator3.render((x, y, color) => this.displayRenderer.setPixel(x, y - 5, color))

    // draw clock
    this.displayRenderer.paddingTop = 6
    this.displayRenderer.lineSpacing = 3
    this.displayRenderer.setColors(0xFFFFFF)
    this.displayRenderer.resetCursor()
    this.displayRenderer.writeLine(this._getCurrentTime())
  }

  _startAnimators() {
    this.animator1.startNewGame()
    this.animator1.totalScoredRows = 60
    this.animator2.startNewGame()
    this.animator2.totalScoredRows = 80
    this.animator3.startNewGame()
    this.animator3.totalScoredRows = 100
  }

  _getCurrentTime() {
    const hours = String(new Date().getHours()).padStart(2, '0')
    const minutes = String(new Date().getMinutes()).padStart(2, '0')
    return `${hours}${minutes}`
  }
}

module.exports = ReadyClockScreen
