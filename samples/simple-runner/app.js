console.info('Neo Pixel Controller')

const render = require('./lib/render.js')
const display = require('./lib/display.js')

const NUM_LEDS = 250

const pause = (milliseconds) => new Promise(res => setTimeout(res, milliseconds));

process.on('unhandledRejection', error => {
  console.error(error)
  render.deinit()
  process.exit(1)
})

process.on('uncaughtException', error => {
  console.error(error)
  render.deinit()
  process.exit(1)
})

process.on ('SIGINT',() => {
  render.deinit()
  process.exit(0)
})

render.init(NUM_LEDS, 10)

display.init(50, 5)
display.setColor(0xFF0000)

/*
setInterval(function () {
  display.writeLine('0123456789')
}, 1000 / 30);
*/

render.testRunner()

