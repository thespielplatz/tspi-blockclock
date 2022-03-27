// @ts-ignore
import WS281x from 'rpi-ws281x-native'
import IRenderer from './IRenderer'

const BLACK = 0x000000

class WS281xRenderer implements IRenderer {
  numLeds: number = 0
  brightness: number = 0

  init(numLeds: number, brightness: number): void {
    this.numLeds = numLeds
    this.brightness = brightness

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

  render(colors: number[]): void {
    let output = []
    for (let i = 0; i < this.numLeds; i++) {
      if (i < colors.length) {
        output[i] = colors[i]
      } else {
        output[i] = BLACK
      }
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
