class AbstractState {
  constructor(statemachine, display) {
    this.display = display
    this.sm = statemachine
    this.isActive = false

    this.is25x10 = this.display.getWidth() === 25 && this.display.getHeight() === 10
  }

  onEnter(options = {}) {}

  onRender(fps) {}
  onMessage(option = {})  {}
  onLeave() {}
}

module.exports = AbstractState

