class ScreenManager {
  constructor({ logger }) {
    this.logger = logger
    this.screensByName = {}
    this.activeScreen = null
    this.nextScreen = null
  }

  addScreen(screen) {
    this.screensByName[screen.name] = screen
  }

  switchToScreenOnNextFrame(screenName, options = {}) {
    this.logger.info(`Switching to ${screenName}`)
    this.nextScreen = { screenName, options }
  }

  render(fps) {
    if (this.nextScreen != null) {
      this._switchToNextScreen()
    }
    if (this.activeScreen != null) {
      this.activeScreen.render(fps)
    }
  }

  _switchToNextScreen() {
    const { screenName, options } = this.nextScreen
    const nextScreen = this.screensByName[screenName]

    if (nextScreen === this.activeScreen) {
      return
    }

    if (this.activeScreen != null) {
      this.activeScreen.leave()
      this.activeScreen = null
    }

    if (nextScreen == null) {
      return
    }

    this.activeScreen = nextScreen
    this.activeScreen.enter(options)
    this.nextScreen = null
  }
}

module.exports = ScreenManager
