const Screen = require('./screen-prototype.js')

class ReadyScreen extends Screen {
  constructor(sm, display, sg) {
    super(sm, display)

    this.sg = sg

    sg.on('play', this.onPlayerPlay.bind(this))
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
  }

  onRender(fps) {
    this.step += 1.0 / fps
    const brightness = Math.min(this.step * 50, 0xFF)

    this.display.fill(0x000000)

    this.display.setColors((brightness << 16) + (brightness << 8) + brightness)
    this.display.writeLine('Tetris', 7, 1, true)
  }
}

module.exports = ReadyScreen
