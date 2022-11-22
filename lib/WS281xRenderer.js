const ws281x = require('rpi-ws281x-native')
const Jetty = require("jetty")

const BLACK = 0x000000
const BRIGHNESS_MAX = 168

class WS281xRenderer {
  constructor(numLeds, brightness, width, revertedRows) {
    this.numLeds = parseInt(numLeds)
    this.brightness = parseInt(brightness)
    this.width = width
    this.revertedRows = []

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
    ws281x.init(this.numLeds, {})

    this.isStub = ws281x.isStub()

    if (this.isStub) {
      this.jetty = new Jetty(process.stdout)
      this.jetty.reset().clear().moveTo([0,0])
    }

    this.pixelData = new Uint32Array(this.numLeds)

    if (this.brightness > BRIGHNESS_MAX) {
      this.brightness = BRIGHNESS_MAX
      console.warn(`Reduced Brightness to ${this.brightness}`)
    }

    ws281x.setBrightness(this.brightness) // below 60%

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
    console.log('Resetting WS281x')
    ws281x.reset()
  }

  render(colors) {
    if (this.isStub) {
      this.renderToConsole(colors)
      return
    }

    // Translate Colors
    for (let i = 0; i < this.numLeds; i++) {
      if (i < this.pixelData.length) {
        this.pixelData[i] = ((0xFF0000 & colors[i]) >> 8) + ((0xFF00 & colors[i]) << 8) + (0xFF & colors[i])
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

    ws281x.render(this.pixelData)
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
