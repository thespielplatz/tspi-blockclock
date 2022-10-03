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

    sg.on('turn', (data, controllerId) => {
      if (this.controllerId !== controllerId) return
      tetris.actionTurn()
    })
    sg.on('left', (data, controllerId) => {
      if (this.controllerId !== controllerId) return
      tetris.actionLeft()
    })
    sg.on('right', (data, controllerId) => {
      if (this.controllerId !== controllerId) return
      tetris.actionRight()
    })
    sg.on('down-pressed', (data, controllerId) => {
      if (this.controllerId !== controllerId) return
      tetris.actionDown(true)
    })
    sg.on('down-released', (data, controllerId) => {
      if (this.controllerId !== controllerId) return
      tetris.actionDown(false)
    })
  }

  onEnter(options) {
    this.key = options.key
    this.name = options.name
    this.controllerId = options.controllerId

    this.display.fill(0)
    tetris.start()
  }

  onLeave() {
    this.controllerId = undefined
  }

  onRender(fps) {
    tetris.update(1.0 / fps)
    this.display.fill(0)
    tetris.draw(this.setPixel.bind(this))
  }

  onScoreChange(score) {
    this.sg.emit('game-update', { 'score': score }, this.controllerId)
  }

  onGameOver(score) {
    this.sg.emit('game-over', { 'score': score }, this.controllerId)
    this.sm.switchTo(Gameover.NAME, { controllerId: this.controllerId})
  }

  setPixel(x, y, c) {
    this.display.setPixel(y,  this.display.getHeight() - x - 1, c)
  }
}

module.exports = GameScreen
