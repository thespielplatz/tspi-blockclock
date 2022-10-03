const Startup = require('./screen-startup.js')

let active_screen = null
let screen_startup = null

const STATE_STARTUP = 'STATE_STARTUP'
const STATE_IDLE = 'STATE_IDLE'

class Statemachine {
  constructor(theDisplay) {
    this.display = theDisplay

    screen_startup = new Startup(this, theDisplay)
  }

  switchTo(state, option = {}) {
    let newScreen = null
    switch (state) {
      case STATE_STARTUP: newScreen = screen_startup; break;
    }

    if (newScreen === active_screen) return
    if (active_screen !== null) active_screen.onLeave()
    if (newScreen === null) return

    active_screen = newScreen
    active_screen.onEnter()
  }

  sendMessage(options = {}) {
    if (active_screen !== null) active_screen.onMessage(options)
  }

  render() {
    if (active_screen !== null) active_screen.render()
  }
}

module.exports = {
  Statemachine,
  STATE_STARTUP,
  STATE_IDLE,

  default: Statemachine
}
