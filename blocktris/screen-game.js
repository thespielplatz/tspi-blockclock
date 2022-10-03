const Screen = require('./screen-prototype.js')

const Tetris = require('./../lib/tetris/tetris.js')
let tetris

class GameScreen extends Screen {
  constructor(sm, display, sg) {
    super(sm, display)

    tetris = new Tetris(display.getHeight(), display.getWidth())

    tetris.setOnScoreChange(this.onScoreChange.bind(this))
    tetris.setOnGameOver(this.onGameOver.bind(this))

    sg.on('turn', () => {
      if (!this.isActive) return
      tetris.actionTurn()
    })
    sg.on('left', () => {
      if (!this.isActive) return
      tetris.actionLeft()
    })
    sg.on('right', () => {
      if (!this.isActive) return
      tetris.actionRight()
    })
    sg.on('down-pressed', () => {
      if (!this.isActive) return
      tetris.actionDown(true)
    })
    sg.on('down-released', () => {
      if (!this.isActive) return
      tetris.actionDown(false)
    })
  }

  onEnter() {
    this.display.fill(0)
    tetris.start()
  }

  onRender(fps) {
    tetris.update(1.0 / fps)
    this.display.fill(0)
    tetris.draw(this.setPixel.bind(this))
  }

  onScoreChange(score) {
    this.sg.emit('game-update', { 'score': score})
  }

  onGameOver(score) {
    this.sg.emit('game-over', { 'score': score})
  }

  setPixel(x, y, c) {
    this.display.setPixel(y,  this.display.getHeight() - x - 1, c)
  }
}

module.exports = GameScreen
