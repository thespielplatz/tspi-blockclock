const Tetris = require('./Tetris')

const defaultOptions = {
  dropPieceAfterEveryMilliSeconds: 30000,
}

class PieceFallingAnimator extends Tetris {
  constructor(dependencies, options) {
    super(dependencies, options)

    const mergedOptions = {
      ...defaultOptions,
      ...options,
    }
    this.dropPieceAfterEveryMilliSeconds = mergedOptions.dropPieceAfterEveryMilliSeconds
    this.spawnPieceInSeconds = null
  }

  render(setPixel) {
    this._renderCurrentPiece(setPixel)
  }

  _spawnPieceIfNecessary() {
    if (this.currentPiece != null) {
      return
    }
    if (this.spawnPieceInSeconds == null) {
      this.spawnPieceInSeconds = Math.random() * this.dropPieceAfterEveryMilliSeconds
      return
    }
    if (this.spawnPieceInSeconds > 0) {
      return
    }
    this._spawnPiece()
    this.spawnPieceInSeconds = null
  }

  _spawnPiece() {
    super._spawnPiece()
    const availableWidth = this.width - this.currentPiece.width()
    this.currentPiece.x = Math.floor(Math.random() * availableWidth)
  }

  _updateCurrentPiece(updateDeltaInMillis) {
    if (this.spawnPieceInSeconds != null) {
      this.spawnPieceInSeconds -= updateDeltaInMillis
      return
    }
    super._updateCurrentPiece(updateDeltaInMillis)
  }

  _writeCurrentPieceIntoGameBoard() {}
}

module.exports = PieceFallingAnimator
