const axios = require('axios')

let dev_height = 21000

class BlockTime {
  constructor(timeintervalInSec = 5) {
    this.timeinterval = timeintervalInSec * 1000

    this.blocktime = 0
    this.vsize = 0

    this.newBlockCallback = undefined
    this.vsizeChangedCallback = undefined
  }

  getVSize() {
    return this.vsize
  }

  getBlockTime() {
    setTimeout(this.getBlockTime.bind(this), this.timeinterval)

    if (process.env.DEV == 1) {
      const self = this
      setTimeout(() => {
        self.processHeightResponse({ data: dev_height })
        self.processVSizeResponse({ data: 21 * 1024 })

        dev_height++
      }, 250)
    } else {
      axios.get('https://mempool.space/api/blocks/tip/height').then(this.processHeightResponse.bind(this), err => { console.log(`Error: ${err}`)})
      axios.get('https://mempool.space/api/mempool').then(this.processVSizeResponse.bind(this), err => { console.log(`Error: ${err}`)})
    }
  }

  processHeightResponse(response) {
    if (response.data == this.blocktime) return

    console.log(`New Block: ${response.data}`)
    this.blocktime = response.data

    if (this.newBlockCallback) this.newBlockCallback(this.blocktime)
  }

  processVSizeResponse(response) {
    if (response.data == this.vsize) return

    this.vsize = response.data.vsize
    if (this.vsizeChangedCallback) this.vsizeChangedCallback(this.vsize)
  }

  setNewBlockCallback(callback) {
    this.newBlockCallback = callback
  }

  setVsizeChangedCallback(callback) {
    this.vsizeChangedCallback = callback
  }

  start() {
    this.getBlockTime()
  }
}

module.exports = BlockTime
