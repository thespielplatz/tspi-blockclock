import IRenderer from './IRenderer'
import chalk from 'chalk'

//const BLOCK_CHAR = '█'
const BLOCK_CHAR = ' '

class ConsoleRenderer implements IRenderer {
  public width = 0
  public height = 0

  init(numLeds: number, brightness: number): void {}
  deinit(): void {  }
  render(colors: number[][]): void {
    for (let row = 0; row < this.height; ++row) {
      let out = ''
      for (let col = 0; col < this.width; ++col) {
        const color = colors[row * this.width + col]
        const r = Math.floor(color / 65536)
        const g = Math.floor((color % 65536) / 256)
        const b = Math.floor(color % 256)

        out += chalk.rgb(r, g, b).inverse('  ')
      }
      console.log(out)
    }
  }
}

export default ConsoleRenderer
