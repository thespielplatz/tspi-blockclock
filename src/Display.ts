import Charset from './Charset'
import IRenderer from './renderer/IRenderer'
import { WRITE_LINE_MODE } from './defines'
import chalk from 'chalk'

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

    this.foregroundBuffer = this.getEmptyBuffer(-1)
    this.backgroundBuffer = this.getEmptyBuffer(0)
  }

  writeLine(text: string):void {
    switch (this.writeLineMode) {
      case WRITE_LINE_MODE.DROP:
        console.error('WRITE_LINE_MODE.DROP Not implemented!')
        break

      case WRITE_LINE_MODE.INSTANT:
      default:
        this.writeForeground(text)
    }
  }

  writeBackgroundPixelData(pixelData: number[]) {
    this.backgroundBuffer = this.getEmptyBuffer(0)
    for (let i = 0; i < pixelData.length; ++i) {
      this.backgroundBuffer[Math.floor(i / this.width)][i % this.width] = pixelData[i]
    }
  }

  private writeForeground(text: string):void {
    this.foregroundBuffer = this.getEmptyBuffer(TRANSPARENT)

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
          if (charDef[row][col] !== 0) this.foregroundBuffer[row][lineCol + col] = this.writeColor
        }
      }

      lineCol += this.charSpacing + charDef[0].length

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
