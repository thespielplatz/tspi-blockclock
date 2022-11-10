
let step = 0, width, height, offset
let pixels = []
let state, fps
let SIZE = 5
let colors = [0xFFFFFF, 0xF0F0F0, 0xFF8800, 0xC0C0C0, 0xB0B0B0]
let finishedCallback = undefined

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}


const start = (w, h, o, fps_) => {
  width = w
  height = h
  offset = o
  pixels = []
  for (let i = 0; i < SIZE * SIZE; i++) pixels.push({ x: offset + i % SIZE, y: -1, c: colors[getRandomInt(colors.length)]})
  state = 'start'
  step = 0
  fps = fps_

  nextStep()
}

const render = (display) => {
  let pixelData = display.getPixelData()
  if (step < 0) return

  for (let i = 0; i < pixels.length; i++) {
    const p = pixels[i]
    if (p.x < 0 || p.x >= width || p.y < 0 || p.y >= height) continue
    pixelData[p.x + p.y * width] = p.c
  }
}

const nextStep = () => {
  if (step < 0) return

  if (state == 'start') nextStepStart()
  if (state == 'drop') nextStepDrop()
  if (state == 'move') nextStepMove()

  if (step < 0) return

  step++

  setTimeout(nextStep, 1000 / fps)
}

const nextStepStart = (pixelData) => {
  if (step < 10) return
  state = 'drop'
  step = 0
}

const nextStepDrop = (pixelData) => {
  //console.log(`${step} ${Math.floor(step / 5)}`)
  if (step < 25) { pixels[Math.floor(step / 5)].y++; return }
  if (step < 45) { pixels[SIZE + Math.floor((step - 25) / 4)].y++; return }
  if (step < 60) { pixels[2 * SIZE + Math.floor((step - 45) / 3)].y++; return }
  if (step < 70) { pixels[3 * SIZE + Math.floor((step - 60) / 2)].y++; return }
  if (step < 75) { pixels[4 * SIZE + Math.floor((step - 70) / 1)].y++; return }
  state = 'move'
  step = 0
}

const nextStepMove = () => {
  for (let i = 0; i < pixels.length; i++) {
    pixels[i].x++
  }

  if (step > width) {
    step = -1
    state = ""
    if (finishedCallback != undefined) finishedCallback()
  }
}

const setFinishedCallback = (callback) => {
  finishedCallback = callback
}

module.exports = {
  start,
  render,
  setFinishedCallback
}
