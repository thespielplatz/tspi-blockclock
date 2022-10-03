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

const writeLine = (text, startingOffset = 0) => {
  if (text.length <= 0) return
  let lineCol = startingOffset

  let formatted = text.toString().toLowerCase()
  formatted = formatted.match(/.{1}/ug)

  for (let i = 0; i < formatted.length; i++) {
    const char = formatted[i]

    const charDef = charset[char]
    if (!charDef) {
      console.warn(`Char: ${char} not in charset`)
      continue
    }

    for (let row = 0; row < charDef.length; ++row) {
      for (let col = 0; col < charDef[row].length; ++col) {
        if (lineCol + col >= width) continue
        let pixelColor = NOT_SET
        if (charDef[row][col] >= 1) pixelColor = color

        let pixelIndex = lineCol + col + row * width

        if (pixelColor !== NOT_SET) {
          pixelData[pixelIndex] = pixelColor
        } else if (nocolor !== NOT_SET) {
          pixelData[pixelIndex] = nocolor
        }
      }
    }

    lineCol += charSpacing + charDef[0].length

    if (lineCol >= width) break;
  }
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
  setColors,
  fill,
  setPixel,
  getPixelData,
  NOT_SET
}
