class AbstractRenderer {
  constructor({ numLeds, brightness, width, revertedRows }) {
    this.numLeds = parseInt(numLeds)
    this.brightness = parseInt(brightness)
    this.width = parseInt(width)
    this.revertedRows = []
    if (typeof revertedRows === 'string') {
      revertedRows.split(',').forEach((rowNumber) => {
        const row = parseInt(rowNumber)
        if (row !== NaN) {
          this.revertedRows.push(row)
        }
      })
    }
  }

  init() {
    console.warn('This is just a stub, implement in actual class.')
  }

  deinit() {
    console.warn('This is just a stub, implement in actual class.')
  }

  render(colors) {
    console.warn('This is just a stub, implement in actual class.', colors)
  }
}

module.exports = AbstractRenderer
