const charset = require('./charset.js')

const BLACK = 0
const NOT_SET = -1

class PixelDisplay {
  static NOT_SET = NOT_SET

  constructor(width, height) {
    this.width = width
    this.height = height

    this.pixelData = new Uint32Array(width * height)
    this.color = 0xA0A0A0
    this.nocolor = BLACK
    this.charSpacing = 1
  }

  getWidth() { return this.width }
  getHeight() { return this.height }
  getPixelData() { return this.pixelData }

  setColors = (color, nocolor = NOT_SET) => {
    this.color = color
    this.nocolor = nocolor
  }

  fill(color) {
    this.pixelData.fill(color)
  }

  setPixel(x, y, color) {
    const i = x + y * this.width
    if (x >= this.width || i >= this.pixelData.length) return
    this.pixelData[i] = color
  }

  writeChar(offX, offY, char, rotated = false) {
    const charDef = charset[char.toLowerCase()]
    if (!charDef) {
      console.warn(`Char: ${char} not in charset`)
      return 0
    }

    for (let row = 0; row < charDef.length; ++row) {
      for (let col = 0; col < charDef[row].length; ++col) {
        if (!rotated && offX + col >= this.width) continue
        if (rotated && offX + row >= this.width) continue

        let pixelColor = NOT_SET
        if (charDef[row][col] >= 1) pixelColor = this.color

        let pixelIndex = 0
        if (!rotated) pixelIndex = offX + col + (offY + row) * this.width
        if (rotated) pixelIndex = offX + row + (this.height - 1 - offY - col) * this.width

        if (pixelIndex < 0 || pixelIndex > this.width * this.height) continue

        if (pixelColor !== NOT_SET) {
          this.pixelData[pixelIndex] = pixelColor
        } else if (this.nocolor !== NOT_SET) {
          this.pixelData[pixelIndex] = this.nocolor
        }
      }
    }

    if (!rotated) return charDef[0].length
    if (rotated) return charDef.length
  }

  writeLine(text, x = 0, y = 0, rotated = false) {
    if (text.length <= 0) return

    let formatted = text.toString().toLowerCase()
    formatted = formatted.match(/.{1}/ug)

    for (let i = 0; i < formatted.length; i++) {
      const char = formatted[i]

      const append = this.writeChar(x, y, char, rotated)
      x += append + this.charSpacing

      if (x >= this.width) break
    }
  }
}

module.exports = PixelDisplay
