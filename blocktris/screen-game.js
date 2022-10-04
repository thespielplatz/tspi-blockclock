const Screen = require('./screen-prototype.js')

const Tetris = require('./../lib/tetris/tetris.js')
let tetris

class GameScreen extends Screen {
  constructor(sm, display, sg) {
    super(sm, display)
    this.sg = sg

    let self = this

    tetris = new Tetris(display.getHeight(), display.getWidth())

    tetris.setOnScoreChange(this.onScoreChange.bind(this))
    tetris.setOnGameOver(this.onGameOver.bind(this))
    tetris.setOnNextPiece(this.onNextPiece.bind(this))

    sg.on('turn', (data, controllerId) => {
      if (self.controllerId !== controllerId) return
      tetris.actionTurn()
    })
    sg.on('left', (data, controllerId) => {
      if (self.controllerId !== controllerId) return
      tetris.actionLeft()
    })
    sg.on('right', (data, controllerId) => {
      if (self.controllerId !== controllerId) return
      tetris.actionRight()
    })
    sg.on('down', (data, controllerId) => {
      if (self.controllerId !== controllerId) return
      tetris.actionDown()
    })
  }

  onEnter(options) {
    this.key = options.key
    this.controllerId = options.controllerId

    this.display.fill(0)
    tetris.start()
  }

  onLeave() {
    this.controllerId = undefined
  }

  onRender(fps) {
    if (!this.isActive) return

    tetris.update(1.0 / fps)
    this.display.fill(0x202020)
    tetris.draw(this.setPixel.bind(this))
  }

  onNextPiece(type, color) {
    this.sg.broadcast('next-piece', { 'type': type, 'color': color }, this.controllerId)
  }

  onScoreChange(score) {
    this.sg.broadcast('game-update', { 'score': score })
  }

  onGameOver(score) {
    this.sg.broadcast('game-over', { 'score': score })
    this.sm.switchTo(Screen.GAME_OVER, { controllerId: this.controllerId})
  }

  setPixel(x, y, c) {
    this.display.setPixel(y,  this.display.getHeight() - x - 1, c)
  }
}

module.exports = GameScreen
