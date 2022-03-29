// @ts-ignore
import WS281x from 'rpi-ws281x-native'
import IRenderer from './IRenderer'
import chalk from 'chalk'

const BLACK = 0x000000

class WS281xRenderer implements IRenderer {
  public reverseAlternateLines = false
  numLeds: number = 0
  brightness: number = 0

  init(numLeds: number, brightness: number): void {
    this.numLeds = numLeds
    this.brightness = brightness

    this.reverseAlternateLines = process.env.WS281_REVERSE_LINES === 'true'

    WS281x.init(numLeds)

    if (this.brightness > 128) {
      this.brightness = 128
      console.warn(`Reduced Brightness to ${this.brightness}`)
    }
    WS281x.setBrightness(brightness) // below 60%
  }

  deinit(): void {
    console.info('Resetting WS281x')
    WS281x.reset()
  }

  render(colors: number[][]): void {
    let output = new Uint32Array(this.numLeds)
    let i = 0

    for (let row = 0; row < colors.length; ++row) {
      for (let col = 0; col < colors[row].length; ++col) {

        let color = 0
        if (row % 2 == 1 && this.reverseAlternateLines) {
          color = colors[row][colors[row].length - 1 - col]
        } else {
          color = colors[row][col]
        }

        output[i] = color
        ++i

        if (i >= this.numLeds) break
      }

      if (i >= this.numLeds) break
    }

    WS281x.render(output)
  }

  testRunner(): void {
    const self = this
    const pause = () => new Promise(res => setTimeout(res, 5));

    let colors = [...Array(50 * 5 - 1)].map(() => 0x600000)
    colors.push(0xFFFFFF)
    let count = 0;

    (async function() {
      while(true) {
        let tmp = []
        for (let i = 0 ;i < self.numLeds; i++) {
          if (i > self.numLeds) break
          tmp[i] = colors[(count + i) % colors.length]
        }
        WS281x.render(tmp)
        count++
        await pause()
      }
    })()
  }
}

export default WS281xRenderer
