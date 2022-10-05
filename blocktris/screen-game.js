const Screen = require('./screen-prototype.js')

const Tetris = require('./../lib/tetris/tetris.js')
let tetris

class GameScreen extends Screen {
  constructor(sm, display, sg) {
    super(sm, display)
    this.sg = sg

    let self = this

    tetris = new Tetris(display.getHeight(), display.getWidth() - 7)

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

    sg.on('controller-disconnected', (controllerId) => {
      if (self.controllerId !== controllerId) return
      self.onControllerLost()
    })
  }

  onEnter(options) {
    this.key = options.key
    this.controllerId = options.controllerId
    this.controllerLost = false

    this.nextPiece = null

    this.display.fill(0)
    tetris.start()

    this.preAnimation = true
    this.startPreanimation()
  }

  onLeave() {
    this.controllerId = undefined
  }

  onControllerLost() {
    this.controllerLost = true
    this.display.fill(0xF00000)
    this.display.setColors(0xFFFFFF)
    this.display.writeLine('abort :(', 1, 1, true)

    const self = this
    setTimeout(() => {
      self.sm.switchTo(Screen.READY)
    }, 2000)
  }

  startPreanimation() {
    const offX = 7
    this.display.setColors(0xFFFFFF)
    this.renderBackground()

    this.display.writeLine('ready?', offX, 1, true)

    const self = this

    setTimeout(() => {
      self.renderBackground()
      self.display.writeChar(offX, 1 , '3', true)
    }, 2000)

    setTimeout(() => {
      self.renderBackground()
      self.display.writeChar(offX, 1 , '2', true)
    }, 3000)

    setTimeout(() => {
      self.renderBackground()
      self.display.writeChar(offX, 1 , '1', true)
    }, 4000)

    setTimeout(() => {
      self.preAnimation = false
    }, 5000)
  }

  onRender(fps) {
    if (!this.isActive) return
    if (this.controllerLost) return

    if (!this.preAnimation) this.onRenderGame(fps)
  }

  renderBackground() {
    this.display.fill(0x202020)
    for (let i = 0; i < 5; ++i) this.display.setPixel(5, i, 0xA0A0A0)
    for (let i = 0; i < 25; ++i) this.display.setPixel(i % 5, Math.floor(i / 5), 0x000000)

    if (this.nextPiece !== null) {
      for (let x = 0; x < this.nextPiece.form[0].length; ++x) {
        for (let y = 0; y < this.nextPiece.form.length; ++y) {
          if (this.nextPiece.form[y][x] == 1) {
            this.display.setPixel(1 + y, this.display.getHeight() - 2 - x, this.nextPiece.color)
          }
        }
      }
    }
  }

  onRenderGame(fps) {
    tetris.update(1.0 / fps)
    this.renderBackground()
    tetris.draw(this.setPixel.bind(this))
  }

  onNextPiece(nextPiece) {
    this.nextPiece = nextPiece
    this.sg.broadcast('next-piece', { 'type': nextPiece.type, 'color': nextPiece.color }, this.controllerId)
  }

  onScoreChange(score) {
    this.sg.broadcast('game-update', { 'score': score })
  }

  onGameOver(score) {
    this.sg.broadcast('game-over', { 'score': score })
    this.sm.switchTo(Screen.GAME_OVER, { controllerId: this.controllerId})
  }

  setPixel(x, y, c) {
    this.display.setPixel(y + 7,  this.display.getHeight() - x - 1, c)
  }
}

module.exports = GameScreen
