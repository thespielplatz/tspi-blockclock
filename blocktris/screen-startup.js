let screen = {}
let display = null

screen.onEnter = (theDisplay) => {
  display = theDisplay
  display.fill(0x000000)
  display.setColors(0xFFFFFF)
  display.writeLine('tetris', 7, 1, true)
}

screen.render = () => {
}

screen.onFinish = () => {

}

screen.setError = (text) => {
  display.fill(0xA00000)
  display.setColors(0xFFFFFF)
  display.writeLine(text + ' :(', 1, 0)
}

module.exports = screen
