const { execSync } = require('child_process')

const ConsoleOutputRenderer = require('./ConsoleOutputRenderer')
const Ws281xOutputRenderer = require('./Ws281xOutputRenderer')

const TESTED_ARCHITECTURE = [
  'armv6l',    // Raspberry PI Zero
  'armv7l',    // Raspberry PI Zero 2 W, 3
  'aarch64'    // Raspberry PI 4
]

class OutputRendererFactory {
  static getOutputRenderer(options) {
    const isWs281xSupported = OutputRendererFactory.isWs281xSupported()
    if (isWs281xSupported instanceof Ws281xSupported) {
      return {
        outputRenderer: new Ws281xOutputRenderer(options),
        isWs281xSupported,
      }
    }
    return {
      outputRenderer: new ConsoleOutputRenderer(options),
      isWs281xSupported,
    }
  }

  static isWs281xSupported() {
    const architecture = execSync('uname -m').toString().trim()
    if (!TESTED_ARCHITECTURE.includes(architecture)) {
      return new Ws281xNotSupported('Device Architecture is not tested on this device.')
    }
    if (!process.getuid || process.getuid() !== 0) {
      return new Ws281xNotSupported('Node process was not started as root. The rpi-ws281x-native package is working internally just with a stub.')
    }
    return new Ws281xSupported()
  }
}

class Ws281xSupported {}

class Ws281xNotSupported {
  constructor(reason) {
    this.reason = reason
  }
}

module.exports = {
  default: OutputRendererFactory,
  OutputRendererFactory,
  Ws281xSupported,
  Ws281xNotSupported,
}
