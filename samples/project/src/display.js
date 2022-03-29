const render = require('./render.js')
const charset = require('./charset.js')

const BLACK = 0

let color = 0xA0A0A0
let charSpacing = 1
let width = 0
let height = 0

const init = (w, h) => {
  width = w
  height = h
}

const setColor = (_color) => {
  color = _color
}

const writeLine = (text) => {
  let lineCol = 0

  let output = [...Array(height)]
  for (let i = 0; i < height; i++) {
    output[i] = [...Array(width)].map(() => 0)
  }

  let formatted = text.toString().toLowerCase()

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
        output[row][lineCol + col] = charDef[row][col] ? color : BLACK
      }
    }

    lineCol += charSpacing + charDef[0].length

    if (lineCol >= width) break;
  }

  output[1] = output[1].reverse()
  output[3] = output[3].reverse()

  const outputInLine = output[0].concat(output[1], output[2], output[3], output[4])

  render.render(outputInLine)
}


module.exports = {
  init,
  writeLine,
  setColor
}
