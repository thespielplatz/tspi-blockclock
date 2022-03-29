import Charset from './Charset'
import IRenderer from './renderer/IRenderer'
import { WRITE_LINE_MODE } from './defines'

const BLACK = 0
const TRANSPARENT = -1

class Display {
  render: IRenderer
  width: number
  height: number

  foregroundBuffer: number[][]
  backgroundBuffer: number[][]

  public writeColor = 0xA0A0A0
  public writeLineMode = WRITE_LINE_MODE.INSTANT
  public charSpacing = 1

  constructor(render: IRenderer, width: number, height: number) {
    this.render = render
    this.width = width
    this.height = height

    this.foregroundBuffer = this.getEmptyBuffer(TRANSPARENT)
    this.backgroundBuffer = this.getEmptyBuffer(BLACK)
  }

  writeBackgroundBuffer(pixelData: number[][]) {
    this.backgroundBuffer = pixelData
  }

  writeBackgroundPixelData(pixelData: number[]) {
    this.backgroundBuffer = this.getEmptyBuffer(BLACK)
    for (let i = 0; i < pixelData.length; ++i) {
      this.backgroundBuffer[Math.floor(i / this.width)][i % this.width] = pixelData[i]
    }
  }

  writeLine(text: string):void {
    switch (this.writeLineMode) {
      case WRITE_LINE_MODE.DROP:
        console.error('WRITE_LINE_MODE.DROP Not implemented!')
        break

      case WRITE_LINE_MODE.INSTANT:
      default:
        this.foregroundBuffer = this.getEmptyBuffer(TRANSPARENT)
        this.writeForeground(0, text)
    }
  }

  writeLastChar(text: string): void {
    let start = this.width
    for (let i = 0; i < text.length; ++i) {
      const char = text[i]
      const charDef = Charset(char)
      if (charDef === null) {
        console.warn(`Char: ${char} not in charset`)
        continue
      }
      start -= charDef[0].length
    }

    this.writeForeground(start, text)
  }

  private writeChar(lineCol: number, char: string): number {
    const charDef = Charset(char)
    if (charDef === null) {
      console.warn(`Char: ${char} not in charset`)
      return lineCol
    }

    for (let row = 0; row < charDef.length; ++row) {
      for (let col = 0; col < charDef[row].length; ++col) {
        if (lineCol + col >= this.width) continue
        this.foregroundBuffer[row][lineCol + col] = charDef[row][col] !== 0 ? this.writeColor : TRANSPARENT
      }
    }

    lineCol += charDef[0].length

    return lineCol
  }

  private writeForeground(lineCol: number, text: string):void {
    let formatted = text.toString().toLowerCase()

    for (let i = 0; i < formatted.length; i++) {
      const char = formatted[i]
      lineCol = this.writeChar(lineCol, char) + this.charSpacing
      if (lineCol >= this.width) break;
    }
  }

  writeBuffer(): void {
    let outputBuffer = this.getEmptyBuffer(-1)

    for (let row = 0; row < this.height; ++row) {
      for (let col = 0; col < this.width; ++col) {
        outputBuffer[row][col] = this.foregroundBuffer[row][col] === TRANSPARENT ? this.backgroundBuffer[row][col] : this.foregroundBuffer[row][col]
      }
    }

    this.render.render(outputBuffer)
  }

  private getEmptyBuffer(fillValue: number): number[][] {
    return new Array(this.height).fill(0).map(() =>new Array(this.width).fill(fillValue))
  }
}

export default Display
