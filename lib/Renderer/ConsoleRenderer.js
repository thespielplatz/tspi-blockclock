const Jetty = require('jetty')

const VALID_ROTATION = [0, 90, 180, 270]
const AbstractRenderer = require('./AbstractRenderer')

class ConsoleRenderer extends AbstractRenderer {
  init() {
    console.info('ConsoleRenderer init')

    this.jetty = new Jetty(process.stdout)
    this.jetty.reset().clear().moveTo([0,0])

    this.rotation = Number(process.env.CONSOLE_RENDERER_ROTATION)
    if (!VALID_ROTATION.includes(this.rotation)) {
      console.warn('ConsoleRenderer: CONSOLE_RENDERER_ROTATION not valid. Setting rotation to 0 degree!')
      this.rotation = 0
    }
  }

  deinit() {
    // Do Nothing
  }

  render(pixelData) {
    for (let i = 0; i < pixelData.length; i++) {
      let charWidth = 0
      let x = 0
      let y = 0

      if (this.rotation === 0) {
        charWidth = 3
        x = i % this.width
        y = Math.floor(i / this.width)
      }
      if (this.rotation === 90) {
        charWidth = 2
        x = (Math.floor(pixelData.length / this.width) - 1 - Math.floor(i / this.width))
        y = i % this.width
      }
      if (this.rotation === 180) {
        charWidth = 3
        x = (pixelData.length - 1 - i) % this.width
        y = Math.floor((pixelData.length - 1 - i) / this.width)
      }
      if (this.rotation === 270) {
        charWidth = 2
        x = Math.floor(i / this.width)
        y = (pixelData.length - 1 - i) % this.width
      }

      const r = Math.floor(((0xFF0000 & pixelData[i]) >> 16) / 255 * 5)
      const g = Math.floor(((0xFF00 & pixelData[i]) >> 8) / 255 * 5)
      const b = Math.floor(((0xFF & pixelData[i])) / 255 * 5)

      this.jetty.moveTo([y, x * charWidth]).rgb([r,g,b]).text(`##${charWidth === 3 ? ' ': ''}`)
    }

    switch (this.rotation) {
      case 0:
      case 180:
        this.jetty.moveTo([pixelData.length / this.width, 0]).rgb([5,5,5])
        break;

      case 90:
      case 270:
        this.jetty.moveTo([this.width + 1, 0]).rgb([5,5,5])
        break;

      default:
        throw new Error('Not Implemented!')
    }
  }
}

module.exports = ConsoleRenderer
