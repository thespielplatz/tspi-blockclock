import Charset from './Charset'
import IRenderer from './renderer/IRenderer'
import { WRITE_LINE_MODE } from './defines'

const BLACK = 0

class Display {
  render: IRenderer
  width: number
  height: number

  outputBuffer: number[][]

  public writeColor = 0xA0A0A0
  public writeLineMode = WRITE_LINE_MODE.INSTANT
  public charSpacing = 1

  constructor(render: IRenderer, width: number, height: number) {
    this.render = render
    this.width = width
    this.height = height

    this.outputBuffer = [...Array(this.height)]
    for (let i = 0; i < this.height; i++) {
      this.outputBuffer[i] = [...Array(this.width)].map(() => 0)
    }
  }

  writeLine(text: string):void {
    switch (this.writeLineMode) {
      case WRITE_LINE_MODE.DROP:
        console.error('WRITE_LINE_MODE.DROP Not implemented!')
        break

      case WRITE_LINE_MODE.INSTANT:
      default:
        this.writeOutput(text)
        this.writeBuffer()
    }
  }

  private writeOutput(text: string):void {
    let lineCol = 0

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
          this.outputBuffer[row][lineCol + col] = charDef[row][col] !== 0 ? this.writeColor : BLACK
        }
      }

      lineCol += this.charSpacing + charDef[0].length

      if (lineCol >= this.width) break;
    }
  }

  private writeBuffer(): void {
    console.log()
    const reverseLine1 = this.outputBuffer[1].reverse()
    const reverseLine3 = this.outputBuffer[3].reverse()

    const outputInLine = this.outputBuffer[0].concat(reverseLine1, this.outputBuffer[2], reverseLine3, this.outputBuffer[4])

    this.render.render(this.outputBuffer)
  }
}

export default Display
