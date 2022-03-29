import 'dotenv/config'
import * as data from './package.json'

import axios from 'axios'

import RenderFactory from './src/renderer/RenderFactory'
import Display from './src/Display'
import { WRITE_LINE_MODE } from './src/defines'
import ConsoleRenderer from './src/renderer/ConsoleRenderer'
import Rainbow from './src/animations/Rainbow'

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
const animate = new Rainbow(NUM_PIXEL)

const rainbowBackground = () => {
  display.writeBackgroundPixelData(animate.getNext())
}

const update = () => {
  rainbowBackground()
  display.writeBuffer()
  setTimeout(update, 1000 / 30)
}

update()
