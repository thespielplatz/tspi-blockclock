const pieces = require('./Pieces')

const stateNone = 'none'
const stateRunning = 'running'
const stateGameOver = 'gameOver'

const defaultOptions = {
  width: 10,
  height: 20,
  callbacks: {
    onGameOver: () => undefined,
  },
}

class Tetris {
  constructor(dependencies, options) {
    this.logger = dependencies.logger

    const mergedOptions = {
      ...defaultOptions,
      ...options,
    }
    this.width = mergedOptions.width
    this.height = mergedOptions.height
    this.callbacks = mergedOptions.callbacks

    this.state = stateNone
  }

  startNewGame() {
    this._resetGameBoard()
    this._resetPieces()
    this._resetScore()
    this.state = stateRunning
  }

  update(updateDeltaInMillis) {
    if (this._isGameOver()) {
      return
    }
    this._spawnPieceIfNecessary()
    this._handlePlayerInput()
    this._updateCurrentPiece(updateDeltaInMillis)
    this._checkFullRows()
  }

  render(setPixel) {
    this._renderGameBoard(setPixel)
    this._renderCurrentPiece(setPixel)
  }

  getCurrentLevel() {
    const completedRowsPerLevel = 10
    return Math.floor(this.totalScoredRows / completedRowsPerLevel) + 1
  }

  _renderGameBoard(setPixel) {
    this.gameBoard.forEach((column, x) => column.forEach((color, y) => {
      setPixel(x, y, color)
    }))
  }

  _renderCurrentPiece(setPixel) {
    if (this.currentPiece == null) {
      return
    }
    this.currentPiece.getCurrentForm().forEach((row, y) => row.forEach((value, x) => {
      if (value !== 1) {
        return true
      }
      setPixel(
        this.currentPiece.x + x,
        this.currentPiece.y + y,
        this.currentPiece.piece.color,
      )
    }))
  }

  _resetGameBoard() {
    this.gameBoard = [...new Array(this.width)]
      .map(() => [...new Array(this.height)].map(() => null))
  }

  _resetPieces() {
    this.currentPiece = null
    this.nextPiece = pieces.getRandomGamePiece(this.width)
  }

  _resetScore() {
    this.totalScoredRows = 0
  }

  _isGameOver() {
    if (this.state === stateGameOver) {
      return true
    }
    if (
      this.currentPiece != null
      || this._canSpawnPiece()
    ) {
      return false
    }
    this.state = stateGameOver
    this.callbacks.onGameOver()
    return true
  }

  _canSpawnPiece() {
    return this.nextPiece.getCurrentForm().every((row, y) => row.every((value, x) => {
      if (value !== 1) {
        return true
      }
      return this.gameBoard[this.nextPiece.x + x][this.nextPiece.y + y] == null
    }))
  }

  _spawnPieceIfNecessary() {
    if (this.currentPiece != null) {
      return
    }
    this._spawnPiece()
  }

  _spawnPiece() {
    this.currentPiece = this.nextPiece
    this.nextPiece = pieces.getRandomGamePiece(this.width)
  }
  
  _handlePlayerInput() {

  }

  _updateCurrentPiece(updateDeltaInMillis) {
    this.currentPiece.deltaMovement += updateDeltaInMillis * this._getGameSpeed()
    const deltaY = this._getDeltaYForCurrentPiece()
    if (deltaY === 0) {
      return
    }
    if (!this._canCurrentPieceMove()) {
      this._writeCurrentPieceIntoGameBoard()
      this._removeCurrentPiece()
      return
    }
    this._moveCurrentPiece(deltaY)
  }

  _getDeltaYForCurrentPiece() {
    const deltaY = Math.floor(this.currentPiece.deltaMovement / 1000)
    this.currentPiece.deltaMovement %= 1000
    return Math.min(deltaY, this.height)
  }

  _canCurrentPieceMove() {
    // check bottom
    if (this.currentPiece.y + this.currentPiece.getCurrentForm().length >= this.height) {
      return false
    }

    // check game board
    return this.currentPiece.getCurrentForm().every((row, y) => row.every((value, x) => {
      if (value !== 1) {
        return true
      }
      return this.gameBoard[this.currentPiece.x + x][this.currentPiece.y + y + 1] == null
    }))
  }

  _writeCurrentPieceIntoGameBoard() {
    this.currentPiece.getCurrentForm().forEach((row, y) => row.forEach((value, x) => {
      if (value !== 1) {
        return
      }
      this.gameBoard[this.currentPiece.x + x][this.currentPiece.y + y] = this.currentPiece.piece.color
    }))
  }

  _removeCurrentPiece() {
    this.currentPiece = null
  }

  _moveCurrentPiece(deltaY) {
    this.currentPiece.y += 1
    if (deltaY > 1 && this._canCurrentPieceMove()) {
      this._moveCurrentPiece(deltaY - 1)
    }
  }

  _getGameSpeed() {
    return 1 / Math.pow(0.8 - ((this.getCurrentLevel() - 1) * 0.007), this.getCurrentLevel() - 1)
  }

  _checkFullRows() {

  }
}

module.exports = Tetris
