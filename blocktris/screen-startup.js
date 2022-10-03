const display = require('../lib/display')

let screen = {}

screen.onEnter = (display) => {
  display.fill(0x000000)
  display.setColors(0xFFFFFF)

  display.writeLine('tetris', 7, 1, true)
}

screen.render = (display) => {
}

screen.onFinish = (display) => {

}

module.exports = screen
