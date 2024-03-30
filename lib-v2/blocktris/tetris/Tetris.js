const defaultOptions = {
  displayWidth: 10,
  displayHeight: 25,
}

class Tetris {
  constructor(options) {
    const mergedOptions = {
      ...defaultOptions,
      ...options,
    }

    this.displayWidth = mergedOptions.displayWidth
    this.displayHeight = mergedOptions.displayHeight
  }

  startNewGame() {}

  update() {}

  render() {}
}

module.exports = Tetris
