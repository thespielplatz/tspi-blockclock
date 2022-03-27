import 'dotenv/config'
import * as data from './package.json'
import RenderFactory from './src/renderer/RenderFactory'

const RENDER_MACHINE: string = process.env.RENDERER || 'stubrenderer'
const PIXEL_WIDTH: number = Number(process.env.PIXEL_WIDTH || 0)
const PIXEL_HEIGHT: number = Number(process.env.PIXEL_HEIGHT || 0)
const NUM_PIXEL = PIXEL_WIDTH * PIXEL_HEIGHT

import axios from 'axios'
import Display from './src/Display'

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

const update = () => {
  axios.get('https://blockstream.info/api/blocks/tip/height').then((response) => {
    console.log(response.data)
    display.writeLine(response.data)
    setTimeout(update, 5000)
  })
}

update()
