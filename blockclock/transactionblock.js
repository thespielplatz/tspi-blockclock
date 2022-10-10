
const colors = [0xFFFFFF, 0xF0F0F0, 0xFF8800, 0xC0C0C0]
function getRandomColor() {
  const i = Math.floor(Math.random() * colors.length)
  return colors[i]
}

const STEP_START = 0.05

class TransactionBlock {
  constructor(size, isFull = false) {
    this.x = 0
    this.y = 0
    this.size = size
    this.transactionMax = this.size * this.size
    this.transactionCount = 0

    this.transactions = []

    if (isFull) {
      for (let i = 0; i < this.transactionMax; ++i) this.addTransaction(true)
    }
  }

  update(step) {
    for (let i = 0; i < this.transactions.length; ++i) {
      let t = this.transactions[i]
      if (t.s > 0) {
        t.s -= step
      } else {
        t.s = STEP_START
        if (t.y < t.toY) t.y++
      }
    }
  }

  render(display) {
    for (let x = 0; x < this.size; x++) {
      for (let y = 0; y < this.size; y++) {
        display.setPixel(this.x + x, this.y + y, 0x707070)
      }
    }

    for (let i = 0; i < this.transactions.length; ++i) {
      let t = this.transactions[i]
      display.setPixel(this.x + t.x, this.y + t.y, t.c)
    }
  }

  setTransactions(count) {
    if (count > this.transactionMax) count = this.transactionMax
    const missing = count - this.transactionCount

    const self = this
    for (let i = 0; i < missing; i++) {
      setTimeout(() => {
        self.addTransaction()

      }, 250 + 250 * i)
    }
  }

  addTransaction(skipAnimation = false) {
    if (this.transactionCount >= this.transactionMax) return

    const x = this.transactionCount % this.size
    const toY = (this.size - Math.floor(this.transactionCount / this.size) - 1)
    const y = (skipAnimation ? toY : -1)

    this.transactions.push({x, y, toY, s: 0, c: getRandomColor()})

    this.transactionCount++
  }

}





module.exports = TransactionBlock
