const ws281x_arm6 = require('rpi-ws281x-native-arm6')
const ws281x_arm7 = require('rpi-ws281x-native')
const Jetty = require("jetty")
const { execSync } = require('child_process')

const BLACK = 0x000000
const BRIGHNESS_MAX = 168

let channel = null

const TESTED_ARCHITECTURE = [
  'armv6l',    // Raspberry PI Zero
  'armv7l',    // Raspberry PI Zero 2 W, 3
  'aarch64'    // Raspberry PI 4
]

class WS281xRenderer {
  constructor(numLeds, brightness, width, revertedRows) {
    this.numLeds = parseInt(numLeds)
    this.brightness = parseInt(brightness)
    this.width = width
    this.revertedRows = []
    this.architecture = null
    this.useArm6Version = false

    if (revertedRows !== undefined) {
      revertedRows = revertedRows.split(',')

      revertedRows.forEach((v) => {
        const row = parseInt(v)
        if (row !== NaN) this.revertedRows.push(row)
      })
    }
  }

  init() {
    console.info('WS281 init')
    this.isStub = false

    this.architecture = execSync('uname -m').toString().trim()
    console.info(`Device Architecture: ${this.architecture}`)

    if (!TESTED_ARCHITECTURE.includes(this.architecture)) {
      this.isStub = true
      console.warn('Running Stub. Device Architecture is not tested on this device')
    } else if (this.architecture === 'armv6l') {
      this.useArm6Version = true
    }

    // If not run as root, the 'rpi-ws281x-native' package is working internally just with a stub
    if (!process.getuid || process.getuid() !== 0) {
      this.isStub = true
    }

    if (this.brightness > BRIGHNESS_MAX) {
      this.brightness = BRIGHNESS_MAX
      console.warn(`Reduced Brightness to ${this.brightness}`)
    }

    if (this.isStub) {
      this.jetty = new Jetty(process.stdout)
      this.jetty.reset().clear().moveTo([0,0])
    } else {
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
    }

    const self = this
    // DeInint Stuff
    process.on('unhandledRejection', error => {
      console.error(error)
      self.deinit()
      process.nextTick(function () { process.exit(1) })
    })

    process.on('uncaughtException', error => {
      console.error(error)
      self.deinit()
      process.nextTick(function () { process.exit(1) })
    })

// ---- trap the SIGINT and reset before exit
    process.on('SIGINT', function () {
      self.deinit()
      process.nextTick(function () { process.exit(0) })
    })
  }

  deinit() {
    if (this.isStub) {
      // Do Nothing
    } else {
      console.log('Resetting WS281x')

      if (this.useArm6Version) {
        ws281x_arm6.reset()
      } else {
        ws281x_arm7.reset()
        ws281x_arm7.finalize()
      }
    }
  }

  render(colors) {
    if (this.isStub) {
      this.renderToConsole(colors)
      return
    }

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

  renderToConsole(pixelData) {
    for (let i = 0; i < pixelData.length; i++) {
      const x = i % this.width * 3
      const y = Math.floor(i / this.width)
      const r = Math.floor(((0xFF0000 & pixelData[i]) >> 16) / 255 * 5)
      const g = Math.floor(((0xFF00 & pixelData[i]) >> 8) / 255 * 5)
      const b = Math.floor(((0xFF & pixelData[i])) / 255 * 5)

      this.jetty.moveTo([y, x]).rgb([r,g,b]).text('## ')
    }

    this.jetty.moveTo([pixelData.length / this.width, 0]).rgb([5,5,5])
  }
}

module.exports = WS281xRenderer
