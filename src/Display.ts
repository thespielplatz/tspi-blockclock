import Charset from './Charset'
import IRenderer from './renderer/IRenderer'

const BLACK = 0

class Display {
  render: IRenderer
  width: number
  height: number

  public writeColor = 0xA0A0A0
  public charSpacing = 1

  constructor(render: IRenderer, width: number, height: number) {
    this.render = render
    this.width = width
    this.height = height
  }

  writeLine(text: string):void {
    let lineCol = 0
    let output = [...Array(this.height)]
    for (let i = 0; i < this.height; i++) {
      output[i] = [...Array(this.width)].map(() => 0)
    }

    let formatted = text.toString().toLowerCase()

    for (let i = 0; i < formatted.length; i++) {
      const char = formatted[i]

      const charDef = Charset(char)
      if (charDef === null) {
        console.warn(`Char: ${char} not in charset`)
        continue
      }

      for (let row = 0; row < charDef.length; ++row) {
        for (let col = 0; col < charDef[row].length; ++col) {
          if (lineCol + col >= this.width) continue
          output[row][lineCol + col] = charDef[row][col] !== 0 ? this.writeColor : BLACK
        }
      }

      lineCol += this.charSpacing + charDef[0].length

      if (lineCol >= this.width) break;
    }

    output[1] = output[1].reverse()
    output[3] = output[3].reverse()

    const outputInLine = output[0].concat(output[1], output[2], output[3], output[4])

    this.render.render(outputInLine)
  }
}

export default Display
