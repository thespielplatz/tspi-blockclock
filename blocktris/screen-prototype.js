class Screen {
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

