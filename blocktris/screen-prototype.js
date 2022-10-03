class Screen {
  constructor(statemachine, display) {
    this.display = display
    this.sm = statemachine
  }

  onEnter() {
    // test
    console.log('proto on enter')
  }

  render() {}
  onMessage(option = {})  {}
  onLeave() {}
}

module.exports = Screen

