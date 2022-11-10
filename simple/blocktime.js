const axios = require('axios')
const {response} = require('express')

let blocktime = 1
let text = ""
const newBlockText = '!! new block !!'

let newBlockStartCallback = undefined
let newBlockEndCallback = undefined
let textColor = 0xFFFFFF

const processResponse = (response) => {
  console.log(response.data)

  if (blocktime == 0) {
    blocktime = response.data
    text = blocktime.toString()
    setTimeout(getBlockTime, 5000)

  } else if (blocktime != response.data) {
    blocktime = response.data
    newBlock()

  } else {
    setTimeout(getBlockTime, 5000)
  }
}

const getBlockTime = () => {
  if (process.env.DEV == 1) {
    const response = { data : 2100 }
    processResponse(response)
    return
  }

  axios.get('https://blockstream.info/api/blocks/tip/height').then(processResponse, err => { setTimeout(getBlockTime, 5000) })
}

const start = () => {
  getBlockTime()
}

const render = function(display) {
  if (blocktime <= 0) return
  display.setColors(textColor)
  display.writeLine(text, 1)
}

const newBlock = () => {
  if (newBlockStartCallback != undefined) newBlockStartCallback()

  text = newBlockText
  setTimeout(() => { textColor = 0xFFFFFF }, 300)
  setTimeout(() => { textColor = 0xB0B0B0 }, 600)
  setTimeout(() => { textColor = 0xFFFFFF }, 900)
  setTimeout(() => { textColor = 0xB0B0B0 }, 1200)
  setTimeout(() => { textColor = 0xFFFFFF }, 1500)
  setTimeout(() => { textColor = 0xB0B0B0 }, 1800)
  setTimeout(() => { textColor = 0xFFFFFF }, 2100)
  setTimeout(() => { textColor = 0xB0B0B0 }, 2400)
  setTimeout(() => { textColor = 0xFFFFFF }, 2700)
  setTimeout(() => {
    text = '       ' + blocktime.toString()
    getBlockTime()
    if (newBlockEndCallback != undefined) newBlockEndCallback()
  }, 6000)
}

const setNewBlockStartCallback = (newCallback) => {
  newBlockStartCallback = newCallback
}
const setNewBlockEndCallback = (newCallback) => {
  newBlockEndCallback = newCallback
}

module.exports = {
  start,
  render,
  setNewBlockStartCallback,
  setNewBlockEndCallback
}
