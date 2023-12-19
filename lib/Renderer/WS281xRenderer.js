const ws281x_arm6 = require('rpi-ws281x-native-arm6')
const ws281x_arm7 = require('rpi-ws281x-native')

const AbstractRenderer = require('./AbstractRenderer')

const BLACK = 0x000000
const BRIGHNESS_MAX = 168

let channel = null

class WS281xRenderer extends AbstractRenderer {
  constructor({ numLeds, brightness, width, revertedRows }, architecture) {
    super({ numLeds, brightness, width, revertedRows })

    this.architecture = architecture
    this.useArm6Version = false
  }

  init() {
    console.info('WS281xRenderer init')

    if (this.architecture === 'armv6l') {
      this.useArm6Version = true
    }

    if (this.brightness > BRIGHNESS_MAX) {
      this.brightness = BRIGHNESS_MAX
      console.warn(`Reduced Brightness to ${this.brightness}`)
    }

    if (this.useArm6Version) {
      ws281x_arm6.init(this.numLeds, {})
      ws281x_arm6.setBrightness(this.brightness)
      this.pixelData = new Uint32Array(this.numLeds)
    } else {
      channel = ws281x_arm7(this.numLeds, {
        brightness: this.brightness,
        stripType: 'ws2812'
      })
      this.pixelData = channel.array
    }

    process.on('unhandledRejection', (error) => {
      console.error(error)
      this.deinit()
      process.nextTick(() => { process.exit(1) })
    })

    process.on('uncaughtException', (error) => {
      console.error(error)
      this.deinit()
      process.nextTick(() => { process.exit(1) })
    })

    process.on('SIGINT', () => {
      this.deinit()
      process.nextTick(() => { process.exit(0) })
    })
  }

  deinit() {
    console.log('Resetting WS281xRenderer')

    if (this.useArm6Version) {
      ws281x_arm6.reset()
    } else {
      ws281x_arm7.reset()
      ws281x_arm7.finalize()
    }
  }

  render(colors) {
    // Translate Colors
    for (let i = 0; i < this.numLeds; i++) {
      if (i < this.pixelData.length) {

	      if (this.useArm6Version) {
            this.pixelData[i] = ((0xFF0000 & colors[i]) >> 8) + ((0xFF00 & colors[i]) << 8) + (0xFF & colors[i])
	      } else {
    	    this.pixelData[i] = colors[i]
	      }

      } else {
        this.pixelData[i] = BLACK
      }
    }

    // Hardcoded hardware line reverse
    for (let row = 0; (row * this.width) < this.pixelData.length; ++row) {
      const startIndex = row * this.width
      if (this.revertedRows.indexOf(row) <= -1) continue

      const line = this.pixelData.slice(startIndex, startIndex + this.width)
      for (let col = 0; col < this.width; ++col) {
        this.pixelData[startIndex + col] = line[line.length - 1 - col]
      }
    }

    if (this.useArm6Version) {
      ws281x_arm6.render(this.pixelData)
    } else {
      ws281x_arm7.render()
    }
  }
}

module.exports = WS281xRenderer
