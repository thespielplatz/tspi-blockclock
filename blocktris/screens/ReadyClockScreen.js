const ReadyScreen = require('./ReadyScreen')

class ReadyClockScreen extends ReadyScreen {
  onRender() {
    const time = this.getCurrentTime()

    this.display.fill(0x000000)
    if (this.is25x10) {
      this.display.writeChar(7, 1, time[0], true)
      this.display.writeChar(7, 5, time[1], true)
      this.display.writeChar(13, 1, time[3], true)
      this.display.writeChar(13, 5, time[4], true)
    } else {
      this.display.writeLine(time, 7, 1, true)
    }
  }

  getCurrentTime() {
    const hours = String(new Date().getHours()).padStart(2, '0')
    const minutes = String(new Date().getMinutes()).padStart(2, '0')
    return `${hours}:${minutes}`
  }
}

module.exports = ReadyClockScreen
