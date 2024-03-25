const AbstractScreen = require('../../screenManager/AbstractScreen.js')

class GameScreen extends AbstractScreen {}

class ReadyClockScreen extends AbstractScreen {}

class ReadyScreen extends AbstractScreen {
  constructor(options) {
    super(options)

    this.socketGames = options.socketGames
    this.socketGames.on('play', this.onPlay.bind(this))
    this.switchToIdleScreenAfterMilliSeconds = options.switchToIdleScreenAfterMilliSeconds

    this.step = 0
    this.activePiece = null
    this.switchToIdleScreenTimeout = null
  }

  enter(options = {}) {
    super.enter(options)
    this.displayRenderer.fill(0x000000)
    this.step = 0

    this.socketGames.broadcast('ready')
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

  render(fps) {
    super.render(fps)
    this.step += 1.0 / fps
    const brightness = Math.min(this.step * 0.25, 1) * 0xFF
    this.displayRenderer.fill(0x000000)
    this.displayRenderer.setColors((brightness << 16) + (brightness << 8) + brightness)

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
