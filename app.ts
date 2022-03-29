import 'dotenv/config'
import * as data from './package.json'

import axios from 'axios'

import RenderFactory from './src/renderer/RenderFactory'
import Display from './src/Display'
import { WRITE_LINE_MODE } from './src/defines'
import ConsoleRenderer from './src/renderer/ConsoleRenderer'
import Matrix from './src/animations/Matrix'

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
let isLoading = true
const updateChars = ['-', '/', '|', '\\']
let updateCharsIndex = 0

const updateText = () => {
  isLoading = true
  axios.get('https://blockstream.info/api/blocks/tip/height').then((response) => {
    console.log(response.data)
    display.writeLine(response.data)
    setTimeout(() => { isLoading = false; display.writeLine(response.data) }, 1000)
    setTimeout(updateText, 5000)
  })
}
updateText()

// Test Background
const animate = new Matrix(PIXEL_WIDTH, PIXEL_HEIGHT)

const rainbowBackground = () => {
  display.writeBackgroundBuffer(animate.getNext())
}

let counter = 0

// TODO: fps to 30
const update = () => {
  if (isLoading) {
    display.writeLastChar(updateChars[updateCharsIndex])

    if (counter % 5 == 0) {
      updateCharsIndex = (updateCharsIndex + 1) % updateChars.length
    }
  }
  if (counter % 3 == 0) {
    rainbowBackground()
  }
  display.writeBuffer()
  setTimeout(update, 1000 / 30)

  counter++
}

update()
