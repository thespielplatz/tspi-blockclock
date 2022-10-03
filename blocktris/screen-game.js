const Screen = require('./screen-prototype.js')
const Gameover = require('./screen-gameover.js')

const Tetris = require('./../lib/tetris/tetris.js')
let tetris

class GameScreen extends Screen {
  static NAME = 'STATE_GAME'

  constructor(sm, display, sg) {
    super(sm, display)
    this.sg = sg

    tetris = new Tetris(display.getHeight(), display.getWidth())

    tetris.setOnScoreChange(this.onScoreChange.bind(this))
    tetris.setOnGameOver(this.onGameOver.bind(this))

    sg.on('turn', () => {
      if (!this.playerId) return
      tetris.actionTurn()
    })
    sg.on('left', () => {
      if (!this.playerId) return
      tetris.actionLeft()
    })
    sg.on('right', () => {
      if (!this.playerId) return
      tetris.actionRight()
    })
    sg.on('down-pressed', () => {
      if (!this.playerId) return
      tetris.actionDown(true)
    })
    sg.on('down-released', () => {
      if (!this.playerId) return
      tetris.actionDown(false)
    })
  }

  onEnter(options) {
    this.playerId = options.playerId
    this.display.fill(0)
    tetris.start()
  }

  onLeave() {
    this.playerId = undefined
  }

  onRender(fps) {
    tetris.update(1.0 / fps)
    this.display.fill(0)
    tetris.draw(this.setPixel.bind(this))
  }

  onScoreChange(score) {
    this.sg.emit('game-update', { 'score': score })
  }

  onGameOver(score) {
    this.sg.emit('game-over', { 'score': score })
    this.sm.switchTo(Gameover.NAME)
  }

  setPixel(x, y, c) {
    this.display.setPixel(y,  this.display.getHeight() - x - 1, c)
  }
}

module.exports = GameScreen
