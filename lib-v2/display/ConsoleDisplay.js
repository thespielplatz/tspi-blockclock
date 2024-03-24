const Jetty = require('jetty')

class ConsoleDisplay {
  constructor() {
    this.jetty = new Jetty(process.stdout)
    this.jetty.reset().clear().moveTo([0, 0])
  }

  /**
   * pixel data is 2-dimensional array
   * x is horizontal
   * y is vertical
   * 0,0 is in top left corner
   */
  draw(pixelData) {
    pixelData.forEach((column, x) => column.forEach((color, y) => {
      const r = Math.floor(((0xFF0000 & color) >> 16) / 255 * 5)
      const g = Math.floor(((0xFF00 & color) >> 8) / 255 * 5)
      const b = Math.floor(((0xFF & color)) / 255 * 5)
      this.jetty.moveTo([y, x * 2])
        .rgb([r, g, b])
        .text('##')
    }))
    this.jetty.moveTo(pixelData[0].length, pixelData.length)
  }
}

module.exports = ConsoleDisplay
