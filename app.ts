import 'dotenv/config'
import * as data from './package.json'

import axios from 'axios'

import RenderFactory from './src/renderer/RenderFactory'
import Display from './src/Display'
import { WRITE_LINE_MODE } from './src/defines'
import ConsoleRenderer from './src/renderer/ConsoleRenderer'

const RENDER_MACHINE: string = process.env.RENDERER || 'stubrenderer'
const PIXEL_WIDTH: number = Number(process.env.PIXEL_WIDTH || 0)
const PIXEL_HEIGHT: number = Number(process.env.PIXEL_HEIGHT || 0)
const NUM_PIXEL = PIXEL_WIDTH * PIXEL_HEIGHT

console.info(`Starting up ${data.name}@${data.version}`)

const render = RenderFactory(RENDER_MACHINE)
if (RENDER_MACHINE === 'consolerenderer') {
  ;(render as ConsoleRenderer).width = PIXEL_WIDTH
  ;(render as ConsoleRenderer).height = PIXEL_HEIGHT
}

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

render.init(NUM_PIXEL, 10)

const display = new Display(render, PIXEL_WIDTH, PIXEL_HEIGHT)
display.writeColor = 0xFFFFFF
display.writeLineMode = WRITE_LINE_MODE.INSTANT

/*
;(async function() {
  display.writeLine('0123456789')
  await pause(10000)
  render.deinit()
})()
*/

setInterval(function () {
  rainbowBackground()
  display.writeBuffer()
}, 1000 / 30)

// Test Foreground
const updateText = () => {
  axios.get('https://blockstream.info/api/blocks/tip/height').then((response) => {
    console.log(response.data)
    display.writeLine(response.data)
    setTimeout(updateText, 5000)
  })
}
updateText()

// Test Background
// ---- animation-loop
let offset = 0
let pixelData = new Array(NUM_PIXEL)
//setInterval(function () {
const rainbowBackground = () => {
  for (let i = 0; i < NUM_PIXEL; i++) {
    pixelData[i] = colorwheel((offset + i) % 256);
  }

  offset = (offset + 1) % 256;

  display.writeBackgroundPixelData(pixelData)
}

function colorwheel(pos: number) {
  pos = 255 - pos;
  if (pos < 85) { return rgb2Int(255 - pos * 3, 0, pos * 3) }
  else if (pos < 170) { pos -= 85; return rgb2Int(0, pos * 3, 255 - pos * 3) }
  else { pos -= 170; return rgb2Int(pos * 3, 255 - pos * 3, 0) }
}

function rgb2Int(r: number, g: number, b: number) {
  return ((r & 0xff) << 16) + ((g & 0xff) << 8) + (b & 0xff)
}
