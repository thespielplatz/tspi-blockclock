const Startup = require('./screen-startup.js')
const Ready = require('./screen-ready.js')
const Game = require('./screen-game.js')

let active_screen = null
let screens = {}

const STATE_STARTUP = 'STATE_STARTUP'
const STATE_READY = 'STATE_READY'
const STATE_GAME = 'STATE_GAME'

class Statemachine {
  constructor(display, sg) {
    screens[STATE_STARTUP] = new Startup(this, display)
    screens[STATE_READY] = new Ready(this, display, sg)
    screens[STATE_GAME] = new Game(this, display, sg)

    this.data = {}
  }

  switchTo(state, option = {}) {
    let newScreen = (state in screens ? screens[state] : null)

    if (newScreen === active_screen) return

    if (active_screen !== null) {
      active_screen.onLeave()
      active_screen.isActive = false
      active_screen = null
    }

    if (newScreen === null) return

    active_screen = newScreen
    active_screen.isActive = true
    active_screen.onEnter()
  }

  sendMessage(options = {}) {
    if (active_screen !== null) active_screen.onMessage(options)
  }

  onRender(fps) {
    if (active_screen !== null) active_screen.onRender(fps)
  }

  setData(key, value) {
    this.data[key] = value
  }

  getData(key) {
    if (!(key in this.data)) return undefined

    return this.data[key]
  }
}

module.exports = {
  Statemachine,
  STATE_STARTUP,
  STATE_READY,
  STATE_GAME,

  default: Statemachine
}
