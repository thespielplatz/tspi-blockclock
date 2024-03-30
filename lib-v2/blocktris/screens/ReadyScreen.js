const GameScreen = require('./GameScreen.js')
const ReadyClockScreen = require('./ReadyClockScreen.js')
const Tetris = require('../tetris/Tetris.js')
const AbstractScreen = require('../../screenManager/AbstractScreen.js')

const defaultOptions = {
  displayWidth: 10,
  displayHeight: 25,
  switchToIdleScreenAfterMilliSeconds: 10000,
}

class ReadyScreen extends AbstractScreen {
  constructor(dependencies, options) {
    super(dependencies)
    const mergedOptions = {
      ...defaultOptions,
      ...options,
    }

    this.socketGames = dependencies.socketGames
    this.socketGames.on('play', this.onPlay.bind(this))

    this.displayWidth = mergedOptions.displayWidth
    this.displayHeight = mergedOptions.displayHeight
    this.switchToIdleScreenAfterMilliSeconds = mergedOptions.switchToIdleScreenAfterMilliSeconds

    this.brightness = 0
    this.tetris = new Tetris(mergedOptions)
    this.switchToIdleScreenTimeout = null
  }

  enter(options = {}) {
    super.enter(options)

    this.socketGames.broadcast('ready')

    this.brightness = 0
    this.tetris.startNewGame()

    if (this.switchToIdleScreenAfterMilliSeconds > 0) {
      this._switchToIdleScreenAfterDelay()
    }
  }

  leave() {
    super.leave()

    if (this.switchToIdleScreenTimeout != null) { 
      clearTimeout(this.switchToIdleScreenTimeout)
      this.switchToIdleScreenTimeout = null
    }
  }

  render(updateDeltaInMillis) {
    super.render(updateDeltaInMillis)

    // draw background
    this.displayRenderer.fill(0x000000)

    // draw tetris game in background
    this.tetris.update(updateDeltaInMillis)
    this.tetris.render(this.displayRenderer)

    // draw text
    this.brightness += updateDeltaInMillis * 0.00025
    const color = Math.min(this.brightness, 1) * 0xFF
    this.displayRenderer.setColors((color << 16) + (color << 8) + color)
    this.displayRenderer.resetCursor()
    this.displayRenderer.writeLine('Tetris')
  }

  onPlay({ key }, controllerId) {
    if (!this.isActive) {
      this.socketGames.emit('not-ready', null, controllerId)
      return
    }

    this.socketGames.emit('start', null, controllerId)
    this.screenManager.switchTo(GameScreen.name, { controllerId, key })
  }

  _switchToIdleScreenAfterDelay() {
    this.switchToIdleScreenTimeout = setTimeout(
      () => this._switchToIdleScreen(),
      this.switchToIdleScreenAfterMilliSeconds,
    )
  }

  _switchToIdleScreen() {
    if (!this.isActive) {
      return
    }
    this.screenManager.switchToScreenOnNextFrame(ReadyClockScreen.name)
  }
}

module.exports = ReadyScreen
