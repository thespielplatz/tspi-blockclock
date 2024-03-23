const CharacterDefinition = require('./CharacterDefinition.js')

const BLACK = 0
const NOT_SET = -1
const DEFAULT_OPTIONS = {
  width: 10,
  height: 25,
  color: 0xA0A0A0,
  noColor: BLACK,
  lineHeight: 5,
  lineSpacing: 1,
  charSpacing: 1,
  paddingTop: 1,
  paddingRight: 1,
  paddingBottom: 1,
  paddingLeft: 1,
}

class Cursor {
  constructor(x, y) {
    this.x = x
    this.y = y
  }
}

class PixelRenderer {
  constructor(options) {
    const mergedOptions = {
      ...DEFAULT_OPTIONS,
      ...options,
    }
    this.width = mergedOptions.width
    this.height = mergedOptions.height
    this.color = mergedOptions.color
    this.noColor = mergedOptions.noColor
    this.lineHeight = mergedOptions.lineHeight
    this.lineSpacing = mergedOptions.lineSpacing
    this.charSpacing = mergedOptions.charSpacing
    this.paddingTop = mergedOptions.paddingTop
    this.paddingRight = mergedOptions.paddingRight
    this.paddingBottom = mergedOptions.paddingBottom
    this.paddingLeft = mergedOptions.paddingLeft

    this.initPixelData()
    this.initCursor()
  }

  /**
   * pixel data is 2-dimensional array
   * x is horizontal
   * y is vertical
   * 0,0 is in top left corner
   */
  initPixelData() {
    this.pixelData = new Array(this.width)
      .map(() => new Uint32Array(this.height).fill(NOT_SET))
  }

  initCursor() {
    this.cursor = new Cursor(this.paddingLeft, this.paddingTop)
  }

  resetCursor() {
    this.initCursor()
  }

  setColors = (color, noColor = NOT_SET) => {
    this.color = color
    this.noColor = noColor
  }

  /**
   * color is RGB in hex (e.g. 0xAA0000)
   */
  fill(color) {
    this.pixelData.forEach((column) => column.fill(color))
  }

  /**
   * color is RGB in hex (e.g. 0xAA0000)
   */
  setPixel(x, y, color) {
    this.pixelData[x][y] = color
  }

  writeChar(char) {
    const characterDefinition = CharacterDefinition.forChar(char)
    if (characterDefinition == null) {
      console.warn(`Char: ${char} not in charset`)
      return
    }
    if (this.paddingLeft + characterDefinition.width + this.paddingRight > this.displayWidth) {
      console.warn(`Char: ${char} too wide for the current display to render`)
      return
    }
    if (this.paddingTop + characterDefinition.height + this.paddingBottom > this.displayHeight) {
      console.warn(`Char: ${char} too high for the current display to render`)
      return
    }
    if (this.cursor.x + characterDefinition.width + this.paddingRight > this.displayWidth) {
      this.carriageReturn()
    }
    if (this.cursor.y + this.lineHeight + this.paddingBottom > this.displayHeight) {
      console.warn(`End of display reached, channot draw next char: ${char}`)
      return
    }

    for (let x = 0; x < characterDefinition.length; x += 1) {
      const deltaY = this.lineHeight - characterDefinition.height
      for (let y = 0; y < characterDefinition.height; y +=1) {
        if (characterDefinition.checkPixel(x, y)) {
          this.setPixel(
            this.cursor.x + x,
            this.cursor.y + deltaY + y,
            this.color,
          )
        }
      }
    }
  }

  /**
   * start a new line and set the cursor to the beginning of that line
   */
  carriageReturn() {
    this.cursor.y += this.lineHeight + this.lineSpacing
    this.cursor.x = this.paddingLeft
  }

  writeLine(text) {
    let formatted = text.toString().toLowerCase()
    formatted = formatted.match(/.{1}/ug)

    for (let i = 0; i < formatted.length; i++) {
      const char = formatted[i]
      this.writeChar(char)
    }
  }
}

module.exports = PixelRenderer
