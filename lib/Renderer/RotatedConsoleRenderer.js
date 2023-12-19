const Jetty = require('jetty')

const AbstractRenderer = require('./AbstractRenderer')

class RotatedConsoleRenderer extends AbstractRenderer {
  init() {
    console.info('RotatedConsoleRenderer init')

    this.jetty = new Jetty(process.stdout)
    this.jetty.reset().clear().moveTo([0,0])
  }

  deinit() {
    // Do Nothing
  }

  render(pixelData) {
    for (let i = 0; i < pixelData.length; i++) {
      const x = (Math.floor(pixelData.length / this.width) - 1 - Math.floor(i / this.width)) * 2
      const y = i % this.width
      const r = Math.floor(((0xFF0000 & pixelData[i]) >> 16) / 255 * 5)
      const g = Math.floor(((0xFF00 & pixelData[i]) >> 8) / 255 * 5)
      const b = Math.floor(((0xFF & pixelData[i])) / 255 * 5)

      this.jetty.moveTo([y, x]).rgb([r,g,b]).text('# ')
    }

    this.jetty.moveTo([this.width + 1, 0]).rgb([5,5,5])
  }
}

module.exports = RotatedConsoleRenderer
