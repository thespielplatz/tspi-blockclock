const Screen = require('./screen-prototype.js')
const Piece = require('.//tetris/piece')

class ReadyScreen extends Screen {
  constructor(sm, display, sg) {
    super(sm, display)

    this.sg = sg

    sg.on('play', this.onPlayerPlay.bind(this))

    this.activePiece = null
  }

  onPlayerPlay({ key, name }, controllerId) {
    // Screen not visible
    if (!this.isActive) {
      this.sg.emit('not-ready', null, controllerId)
      return
    }

    this.sg.emit('start', null, controllerId)
    this.sm.switchTo(Screen.GAME, { controllerId, key })
  }

  onEnter(options) {
    this.display.fill(0x000000)
    this.step = 0

    this.sg.broadcast('ready')
  }

  onRender(fps) {
    const theStep = 1.0 / fps
    this.step += theStep
    const brightness = Math.min(this.step * 0.25, 1) * 0xFF

    this.display.fill(0x000000)

    if (this.activePiece == null) {
      this.activePiece = Piece.create()
      this.activePiece.y = Math.floor(Math.random() * (this.display.getHeight() - this.activePiece.form.length) + 1)
      this.activePiece.x = -Math.floor(Math.random() * 200)
      this.activePiece.speed = 10.0 + Math.random() * 40.0
    } else {
      this.activePiece.x += theStep * this.activePiece.speed

      if (this.activePiece.x >= this.display.getWidth() - 1) {
        this.activePiece = null
      }

      if (this.activePiece != null && this.activePiece.x >= 0) {
        for (let x = 0; x < this.activePiece.form[0].length; ++x) {
          for (let y = 0; y < this.activePiece.form.length; ++y) {
            if (this.activePiece.form[y][x] == 1) {
              this.display.setPixel(Math.floor(this.activePiece.x) + x, this.activePiece.y + y, this.activePiece.color)
            }
          }
        }
      }

    }

    this.display.setColors((brightness << 16) + (brightness << 8) + brightness)
    this.display.writeLine('Tetris', 7, 1, true)
  }
}

module.exports = ReadyScreen
