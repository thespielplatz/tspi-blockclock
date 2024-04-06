class AbstractScreen {
  constructor({
    screenManager,
    displayRenderer,
    logger,
  }, { name }) {
    this.screenManager = screenManager
    this.displayRenderer = displayRenderer
    this.logger = logger

    this.name = name

    this.isActive = false
  }

  enter(options = {}) {
    this.isActive = true
  }

  leave() {
    this.isActive = false
  }

  render(updateDeltaInMillis) {}
}

module.exports = AbstractScreen
