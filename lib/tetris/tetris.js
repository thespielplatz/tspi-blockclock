const rotateMatrix90C = require('./tools.js').rotateMatrix90C
const Piece = require('./piece.js')

const STATE_NONE = 'STATE_NONE'
const STATE_PLAY = 'STATE_PLAY'

let onScoreChangedCallback = undefined
let onGameOverCallback = undefined

let tetris = {
}

tetris.setup = (w, h) => {
  this.state = STATE_NONE
  this.width = w
  this.height = h
  this.data = Array(w).fill(-1).map(x => Array(h).fill(-1))
  this.active = undefined

  this.colors = ['#FF0000', '#F0EC2D', '#B5F11D', '#0000FF']
  this.colors = [0xFF0000, 0x00FFFF, 0x00FF00, 0x0000FF]

  this.speed = 5.0
}

// ---------- Game

tetris.start = () => {
  this.active = undefined
  this.pressed = false
  this.score = 0
  this.steps = 0
  this.state = STATE_PLAY
}

tetris.setOnGameOver = (callback) => {
  onGameOverCallback = callback
}


tetris.update = (step) => {
  if (this.state !== STATE_PLAY) return

  this.steps += this.speed * step * (this.pressed ? 4 : 1)

  if (this.active === undefined) {
    this.active = Piece.create()
    this.active.color = tetris.getRandomColor()

    if (tetris.checkCollision()) {
      this.state = STATE_NONE
      this.active = undefined
      console.log('Game Over')
      if (onGameOverCallback) onGameOverCallback()
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

  if (tetris.checkCollision()) {
    this.active.y--

    tetris.setPiece()
    tetris.checkFullRows()
    this.active = undefined
    this.steps = -1

    tetris.addScore(1)
  }
}

tetris.checkCollision = () => {
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

tetris.checkFullRows = () => {
  let foundRows = []

  for (let y = 0; y < this.height; ++y) {
    let rowCounter = 0
    for (let x = 0; x < this.width; ++x) {

      if (this.data[x][y] >= 0) rowCounter++
    }
    if (rowCounter >= this.width) foundRows.push(y)
  }

  if (foundRows.length <= 0) return false

  for (let i = 0; i < foundRows.length; ++i) {
    const row = foundRows[i]

    for (let y = row; y > 0; --y) {

      for (let x = 0; x < this.width; ++x) {
        this.data[x][y] = this.data[x][y - 1]
      }
    }

    for (let x = 0; x < this.width; ++x) this.data[x][0] = -1
  }

  let score = 0
  switch (foundRows.length) {
    case 1: score = 10; break;
    case 2: score = 25; break;
    case 3: score = 40; break;
    case 4: score = 60; break;
  }
  tetris.addScore(score)

  return true
}

// ---------- Draw

tetris.draw = (display) => {
  // active
  if (this.active != undefined) {
    const c = this.colors[this.active.color]

    for (let x = 0; x < this.active.form[0].length; ++x) {
      for (let y = 0; y < this.active.form.length; ++y) {
        if (this.active.form[y][x] == 1) {
          display.setPixel(this.active.x + x, this.active.y + y, c)
        }
      }
    }
  }

  // Background
  for (let x = 0; x < this.width; ++x) {
    for (let y = 0; y < this.height; ++y) {

      if (this.data[x][y] < 0) continue
      const c = this.colors[this.data[x][y]]
      display.setPixel(x, y, c)
    }
  }
}

// ---------- Scoreing

tetris.addScore = (scoreAdd) => {
  this.score += scoreAdd
  console.log(`Score: ${this.score}`)
  if (onScoreChangedCallback) onScoreChangedCallback(this.score)
}

tetris.setOnScoreChange = (callback) => {
  onScoreChangedCallback = callback
}

// ---------- Input

tetris.actionLeft = () => {
  if (this.state !== STATE_PLAY) return
  if (this.active != undefined && this.active.x > 0) this.active.x--

  if (tetris.checkCollision()) this.active.x++
}

tetris.actionRight = () => {
  if (this.state !== STATE_PLAY) return
  if (this.active != undefined && this.active.x + this.active.form[0].length < this.width) this.active.x++

  if (tetris.checkCollision()) this.active.x--
}

tetris.actionDown = (pressed) => {
  if (this.state !== STATE_PLAY) return
  this.pressed = pressed
  if (pressed === false) {
    this.steps = 0
  }
}

tetris.actionTurn = () => {
  if (this.state !== STATE_PLAY) return
  if (this.active == undefined) return
  const oldForm = this.active.form
  const newForm = rotateMatrix90C(oldForm)

  if (this.active.x + newForm[0].length < 1 + this.width) {
    this.active.form = newForm

    if (tetris.checkCollision()) this.active.form = oldForm
  }
}

// ---------- Helper

tetris.getRandomColor = () => {
  return Math.floor(Math.random() * this.colors.length)
}

tetris.setPiece = () => {
  // Copy Piece in background
  for (let x = 0; x < this.active.form[0].length; ++x) {
    for (let y = 0; y < this.active.form.length; ++y) {
      if (this.active.form[y][x] == 1) {
        this.data[this.active.x + x][this.active.y + y] = this.active.color
      }
    }
  }
}

module.exports = tetris
