const Startup = require('./screen-startup.js')
const Ready = require('./screen-ready.js')
const Game = require('./screen-game.js')
const GameOver = require('./screen-gameover.js')

let active_screen = null
let screens = {}
let next_screen = null

class StateMachine {
  constructor() {
    this.data = {}
  }

  addScreen(screenName, screen) {
    screens[screenName] = screen
  }

  switchTo(state, options = {}) {
    console.info(`Switching to ${state}`)
    next_screen = {state, options}
  }

  switchToNextScreen() {
    let state = next_screen.state
    let options = next_screen.options

    let newScreen = (state in screens ? screens[state] : null)

    if (newScreen === active_screen) return

    if (active_screen !== null) {
      active_screen.isActive = false
      active_screen.onLeave()
      active_screen = null
    }

    if (newScreen === null) return

    active_screen = newScreen
    active_screen.isActive = true
    active_screen.onEnter(options)
  }

  sendMessage(options = {}) {
    if (active_screen !== null) active_screen.onMessage(options)
  }

  onRender(fps) {
    if (next_screen !== null) {
      this.switchToNextScreen()
      next_screen = null
    }
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
  StateMachine,

  default: StateMachine
}
