const rotateMatrix90C = require('./tools.js').rotateMatrix90C
const Piece = require('./piece.js')

const STATE_NONE = 'STATE_NONE'
const STATE_PLAY = 'STATE_PLAY'
const STATE_ANIMATING = 'STATE_ANIMATING'

const COMPLETED_ROWS_PER_LEVEL = 10

class Tetris {
  constructor(w, h) {
    this.state = STATE_NONE
    this.width = w
    this.height = h
    this.data = undefined
    this.active = undefined

    this.startSpeed = 5.0
    this.difficultyPiecesCount = 10
  }
  // ---------- Game

  start() {
    this.data = Array(this.width).fill(-1).map(x => Array(this.height).fill(-1))
    this.active = undefined
    this.pressed = false
    this.steps = 0
    this.state = STATE_PLAY
    this.fallingDown = false
    this.nextPiece = null
    this.numOfPieces = 0

    // level + scoring
    this.totalScoredRows = 0
    this.score = 0
    this.previousScoreWasFullTetris = false

    this.createPiece()
  }

  setOnGameOver(callback) {
    this.onGameOverCallback = callback
  }

  setOnNextPiece(callback) {
    this.onNextPieceCallback = callback
  }

  createPiece() {
    this.numOfPieces++
    this.nextPiece = Piece.create(this.width)
    if (this.onNextPieceCallback) this.onNextPieceCallback(this.nextPiece)
  }

  update(step) {
    if (this.state !== STATE_PLAY) return

    // check next piece
    if (this.nextPiece === null) this.createPiece()

    if (this.fallingDown) {
      this.steps = 300 * step
    } else {
      this.steps += this.getGameSpeed(step)
    }

    if (this.active === undefined) {
      this.active = this.nextPiece
      this.nextPiece = null

      if (this.checkCollision()) {
        this.state = STATE_NONE
        this.active = undefined
        if (this.onGameOverCallback) this.onGameOverCallback(this.score)
        return
      }
    }

    if (this.steps >= 1) {
      this.steps -= 1
    } else {
      return
    }

    if (this.active === undefined) return

    this.active.y++

    if (this.checkCollision()) {
      this.active.y--

      this.setPiece()
      this.checkFullRows()
      this.active = undefined
      this.steps = -1
      this.fallingDown = false
    }
  }

  checkCollision() {
    if (this.active === undefined) return

    // Check Bottom
    if (this.active.y + this.active.form.length > this.height) {
      return true
    }

    // Check Background
    for (let x = 0; x < this.active.form[0].length; ++x) {
      for (let y = 0; y < this.active.form.length; ++y) {
        if (this.active.form[y][x] == 1) {
          if (this.data[this.active.x + x][this.active.y + y] >= 0) {
            return true
          }
        }
      }
    }

    return false
  }

  checkFullRows() {
    let foundRows = []

    for (let y = 0; y < this.height; ++y) {
      let rowCounter = 0
      for (let x = 0; x < this.width; ++x) {

        if (this.data[x][y] >= 0) rowCounter++
      }
      if (rowCounter >= this.width) foundRows.push(y)
    }

    if (foundRows.length <= 0) return false

    this.state = STATE_ANIMATING
    const self = this

    this.colorRows(foundRows, 0xF0F0F0)

    setTimeout(() => {
      self.colorRows(foundRows, 0xFFFFFF)
    }, 100)

    setTimeout(() => {
      self.colorRows(foundRows, 0xF0F0F0)
    }, 200)

    setTimeout(() => {
      self.removeRows(foundRows)
      self.state = STATE_PLAY
    }, 300)

    let score = 0
    switch (foundRows.length) {
      case 1:
        score = 100
        this.previousScoreWasFullTetris = false
        break
      case 2:
        score = 300
        this.previousScoreWasFullTetris = false
        break
      case 3:
        score = 500
        this.previousScoreWasFullTetris = false
        break
      case 4:
        score = this.previousScoreWasFullTetris ? 1200 : 800
        this.previousScoreWasFullTetris = true
        break
    }

    // first score, then increase level
    this.addScore(score * this.getLevel())
    this.totalScoredRows += foundRows.length

    // add bonus score for softdrop (pressing down-button)
    if (this.fallingDown) {
      this.addScore(this.totalScoredRows)
    }

    return true
  }

  getGameSpeed(updateDeltaInSeconds) {
    return updateDeltaInSeconds * (1 / Math.pow(0.8 - ((this.getLevel() - 1) * 0.007), this.getLevel() - 1))
  }

  getLevel() {
    return Math.floor(this.totalScoredRows / COMPLETED_ROWS_PER_LEVEL) + 1
  }

  colorRows(rows, color) {
    for (let i = 0; i < rows.length; ++i) {
      for (let x = 0; x < this.width; ++x) {
        this.data[x][rows[i]] = color
      }
    }
  }

  removeRows(foundRows) {
    for (let i = 0; i < foundRows.length; ++i) {
      const row = foundRows[i]

      for (let y = row; y > 0; --y) {

        for (let x = 0; x < this.width; ++x) {
          this.data[x][y] = this.data[x][y - 1]
        }
      }

      for (let x = 0; x < this.width; ++x) this.data[x][0] = -1
    }
  }

  // ---------- Draw

  draw(setPixel) {
    // active
    if (this.active != undefined) {
      for (let x = 0; x < this.active.form[0].length; ++x) {
        for (let y = 0; y < this.active.form.length; ++y) {
          if (this.active.form[y][x] == 1) {
            setPixel(this.active.x + x, this.active.y + y, this.active.color)
          }
        }
      }
    }

    // Background
    for (let x = 0; x < this.width; ++x) {
      for (let y = 0; y < this.height; ++y) {

        if (this.data[x][y] < 0) continue
        setPixel(x, y, this.data[x][y])
      }
    }
  }

  // ---------- Scoreing

  addScore(scoreAdd) {
    this.score += scoreAdd
    console.log(`Score: ${this.score}`)
    console.log(`Lines: ${this.totalScoredRows}`)
    if (this.onScoreChangedCallback) this.onScoreChangedCallback(this.score)
  }

  setOnScoreChange(callback) {
    this.onScoreChangedCallback = callback
  }

  // ---------- Input

  actionLeft() {
    if (this.state !== STATE_PLAY) return
    if (this.active != undefined && this.active.x > 0) this.active.x--

    if (this.checkCollision()) this.active.x++
  }

  actionRight() {
    if (this.state !== STATE_PLAY) return
    if (this.active != undefined && this.active.x + this.active.form[0].length < this.width) this.active.x++

    if (this.checkCollision()) this.active.x--
  }

  actionDown() {
    if (this.state !== STATE_PLAY) return
    this.fallingDown = true
  }

  actionTurn() {
    if (this.state !== STATE_PLAY) return
    if (this.active == undefined) return
    const oldForm = this.active.form
    const newForm = rotateMatrix90C(oldForm)

    if (this.active.x + newForm[0].length >= this.width) {
      this.active.x = this.width - newForm[0].length
    }

    this.active.form = newForm
    if (this.checkCollision()) this.active.form = oldForm
  }

  // ---------- Helper
  setPiece() {
    // Copy Piece in background
    for (let x = 0; x < this.active.form[0].length; ++x) {
      for (let y = 0; y < this.active.form.length; ++y) {
        if (this.active.form[y][x] == 1) {
          this.data[this.active.x + x][this.active.y + y] = this.active.color
        }
      }
    }
  }
}

module.exports = Tetris
