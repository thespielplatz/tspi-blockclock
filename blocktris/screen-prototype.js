class Screen {
  static STARTUP = 'STATE_STARTUP'
  static GAME = 'STATE_GAME'
  static GAME_OVER = 'STATE_GAME_OVER'
  static READY = 'STATE_READY'

  constructor(statemachine, display) {
    this.display = display
    this.sm = statemachine
    this.isActive = false
  }

  onEnter(options = {}) {
    // test
    console.log('proto on enter')
  }

  onRender(fps) {}
  onMessage(option = {})  {}
  onLeave() {}
}

module.exports = Screen

