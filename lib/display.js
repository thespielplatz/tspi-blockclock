const charset = require('./charset.js')

const BLACK = 0
const NOT_SET = -1

let color = 0xA0A0A0, nocolor = BLACK
let charSpacing = 1
let width = 0
let height = 0

let pixelData = undefined

const init = (w, h) => {
  width = w
  height = h
  pixelData = new Uint32Array(width * height)
}

const getPixelData = () => {
  return pixelData
}

const setColors = (_color, _nocolor = NOT_SET) => {
  color = _color
  nocolor = _nocolor
}

const writeLine = (text, x = 0, y = 0, rotated = false) => {
  if (text.length <= 0) return

  let formatted = text.toString().toLowerCase()
  formatted = formatted.match(/.{1}/ug)

  for (let i = 0; i < formatted.length; i++) {
    const char = formatted[i]

    const append = writeChar(x, y, char, rotated)
    x += append + charSpacing

    if (x >= width) break
  }
}

const writeChar = (offX, offY, char, rotated = false) => {
  const charDef = charset[char.toLowerCase()]
  if (!charDef) {
    console.warn(`Char: ${char} not in charset`)
    return 0
  }

  for (let row = 0; row < charDef.length; ++row) {
    for (let col = 0; col < charDef[row].length; ++col) {
      if (!rotated && offX + col >= width) continue
      if (rotated && offX + row >= width) continue

      let pixelColor = NOT_SET
      if (charDef[row][col] >= 1) pixelColor = color

      let pixelIndex = 0
      if (!rotated) pixelIndex = offX + col + (offY + row) * width
      if (rotated) pixelIndex = offX + row + (height - 1 - offY - col) * width

      if (pixelIndex < 0 || pixelIndex > width * height) continue

      if (pixelColor !== NOT_SET) {
        pixelData[pixelIndex] = pixelColor
      } else if (nocolor !== NOT_SET) {
        pixelData[pixelIndex] = nocolor
      }
    }
  }

  if (!rotated) return charDef[0].length
  if (rotated) return charDef.length
}

const fill = (color) => {
  for (let i = 0; i < pixelData.length; i++) pixelData[i] = color
}

const setPixel = (x, y, color) => {
  pixelData[x + y * width] = color
}

module.exports = {
  init,
  writeLine,
  writeChar,
  setColors,
  fill,
  setPixel,
  getPixelData,
  getWidth: () =>  { return width },
  getHeight: () =>  { return height },
  NOT_SET
}
