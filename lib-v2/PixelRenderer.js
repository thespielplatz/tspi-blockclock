const CharacterDefinition = require('./CharacterDefinition.js')

const DEFAULT_OPTIONS = {
  displayWidth: 10,
  displayHeight: 25,
  color: 0xA0A0A0,
  backgroundColor: 0x000000,
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
  constructor({ logger, options }) {
    this.logger = logger
    const mergedOptions = {
      ...DEFAULT_OPTIONS,
      ...options,
    }
    this.displayWidth = mergedOptions.displayWidth
    this.displayHeight = mergedOptions.displayHeight
    this.color = mergedOptions.color
    this.backgroundColor = mergedOptions.backgroundColor
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
    this.pixelData = [...new Array(this.displayWidth)]
      .map(() => new Uint32Array(this.displayHeight).fill(this.backgroundColor))
  }

  initCursor() {
    this.cursor = new Cursor(this.paddingLeft, this.paddingTop)
  }

  resetCursor() {
    this.initCursor()
  }

  setColors = (color, backgroundColor = this.backgroundColor) => {
    this.color = color
    this.backgroundColor = backgroundColor
  }

  clear() {
    this.fill(this.backgroundColor)
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
      this.logger.warn(`Char: ${char} not in charset`)
      return
    }
    if (this.paddingLeft + characterDefinition.width + this.paddingRight > this.displayWidth) {
      this.logger.warn(`Char: ${char} too wide for the current display to render`)
      return
    }
    if (this.paddingTop + characterDefinition.height + this.paddingBottom > this.displayHeight) {
      this.logger.warn(`Char: ${char} too high for the current display to render`)
      return
    }
    if (this.cursor.x + characterDefinition.width + this.paddingRight > this.displayWidth) {
      this.carriageReturn()
    }
    if (this.cursor.y + this.lineHeight + this.paddingBottom > this.displayHeight) {
      this.logger.warn(`End of display reached, channot draw next char: ${char}`)
      return
    }

    this.drawCharacterAtCursor(characterDefinition)
    this.moveCursor(characterDefinition.width + this.charSpacing)
  }

  drawCharacterAtCursor(characterDefinition) {
    for (let x = 0; x < characterDefinition.width; x += 1) {
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

  moveCursor(distance) {
    this.cursor.x += distance
  }

  /**
   * start a new line and set the cursor to the beginning of that line
   */
  carriageReturn() {
    this.cursor.y += this.lineHeight + this.lineSpacing
    this.cursor.x = this.paddingLeft
  }

  writeLine(text) {
    const preparedText = this.prepareTextForWriting(text)
    preparedText.forEach((char) => this.writeChar(char))
  }

  prepareTextForWriting(text) {
    return text
      .toString()
      .toLowerCase()
      .match(/.{1}/ug)
  }
}

module.exports = PixelRenderer
