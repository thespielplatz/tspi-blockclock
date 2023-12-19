const { execSync } = require('child_process')

const ConsoleRenderer = require('./ConsoleRenderer')
const RotatedConsoleRenderer = require('./RotatedConsoleRenderer')
const WS281xRenderer = require('./WS281xRenderer')
const RotatedWS281xRenderer = require('./RotatedWS281xRenderer')

const TESTED_ARCHITECTURE = [
  'armv6l',    // Raspberry PI Zero
  'armv7l',    // Raspberry PI Zero 2 W, 3
  'aarch64'    // Raspberry PI 4
]

class RendererFactory {
  static getRenderer({ numLeds, brightness, width, revertedRows }) {
    const architecture = execSync('uname -m').toString().trim()
    console.info(`Device Architecture: ${architecture}`)

    if (!TESTED_ARCHITECTURE.includes(architecture)) {
      console.warn('Running ConsoleRenderer. Device Architecture is not tested on this device.')
      return RendererFactory.getConsoleRenderer({ numLeds, brightness, width, revertedRows })
    }

    if (!process.getuid || process.getuid() !== 0) {
      console.warn('Running ConsoleRenderer. If not run as root, the rpi-ws281x-native package is working internally just with a stub.')
      return RendererFactory.getConsoleRenderer({ numLeds, brightness, width, revertedRows })
    }

    if (process.env.RENDERER_ROTATE) {
      return new RotatedWS281xRenderer({ numLeds, brightness, width, revertedRows }, architecture)
    }

    return new WS281xRenderer({ numLeds, brightness, width, revertedRows }, architecture)
  }

  static getConsoleRenderer({ numLeds, brightness, width, revertedRows }) {
    if (process.env.CONSOLE_RENDERER_ROTATE) {
      return new RotatedConsoleRenderer({ numLeds, brightness, width, revertedRows })
    }
    return new ConsoleRenderer({ numLeds, brightness, width, revertedRows })
  }
}

module.exports = RendererFactory
