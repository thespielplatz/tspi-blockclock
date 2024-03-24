const { execSync } = require('child_process')

const ConsoleDisplay = require('./ConsoleDisplay')
const WS281xDisplay = require('./WS281xDisplay')

const TESTED_ARCHITECTURE = [
  'armv6l',    // Raspberry PI Zero
  'armv7l',    // Raspberry PI Zero 2 W, 3
  'aarch64'    // Raspberry PI 4
]

class DisplayFactory {
  static isWS281xSupported() {
    const architecture = execSync('uname -m').toString().trim()
    if (!TESTED_ARCHITECTURE.includes(architecture)) {
      return new WS281xNotSupported('Device Architecture is not tested on this device.')
    }
    if (!process.getuid || process.getuid() !== 0) {
      return new WS281xNotSupported('Node process was not started as root. The rpi-ws281x-native package is working internally just with a stub.')
    }
    return new WS281xSupported()
  }

  static getDisplay(options) {
    if (DisplayFactory.isWS281xSupported() instanceof WS281xSupported) {
      return new WS281xDisplay(options)
    }
    return new ConsoleDisplay(options)
  }
}

class WS281xSupported {}

class WS281xNotSupported {
  constructor(reason) {
    this.reason = reason
  }
}

module.exports = {
  default: DisplayFactory,
  DisplayFactory,
  WS281xSupported,
  WS281xNotSupported,
}
