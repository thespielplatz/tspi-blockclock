import 'dotenv/config'
import * as data from './package.json'

import axios from 'axios'

import RenderFactory from './src/renderer/RenderFactory'
import Display from './src/Display'
import { WRITE_LINE_MODE } from './src/defines'

const RENDER_MACHINE: string = process.env.RENDERER || 'stubrenderer'
const PIXEL_WIDTH: number = Number(process.env.PIXEL_WIDTH || 0)
const PIXEL_HEIGHT: number = Number(process.env.PIXEL_HEIGHT || 0)
const NUM_PIXEL = PIXEL_WIDTH * PIXEL_HEIGHT

console.info(`Starting up ${data.name}@${data.version}`)

const render = RenderFactory(RENDER_MACHINE)

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
display.writeColor = 0xFF0000
display.writeLineMode = WRITE_LINE_MODE.INSTANT

/*
;(async function() {
  display.writeLine('0123456789')
  await pause(10000)
  render.deinit()
})()
*/

// Test
const update = () => {
  axios.get('https://blockstream.info/api/blocks/tip/height').then((response) => {
    console.log(response.data)
    display.writeLine(response.data)
    setTimeout(update, 5000)
  })
}

update()
