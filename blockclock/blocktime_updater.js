const axios = require('axios')

class BlockTime {
  constructor(timeintervalInSec = 5) {
    this.timeinterval = timeintervalInSec * 1000

    this.blocktime = 0
    this.vsize = 0

    this.newBlockCallback = undefined
    this.vsizeChangedCallback = undefined
  }

  getBlockTime() {
    setTimeout(this.getBlockTime.bind(this), this.timeinterval)

    const self = this

    axios.get('https://mempool.space/api/mempool').then((response) => {
      if (response.data == self.vsize) return

      //console.log(`Mempool VSize Change: ${response.data.vsize}`)
      self.vsize = response.data.vsize
      if (self.vsizeChangedCallback) self.vsizeChangedCallback(self.vsize)
    })

    axios.get('https://mempool.space/api/blocks/tip/height').then((response) => {
      if (response.data == self.blocktime) return

      console.log(`New Block: ${response.data}`)
      self.blocktime = response.data
      if (self.newBlockCallback) self.newBlockCallback(self.blocktime)
    })
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
