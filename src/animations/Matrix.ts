const MAX_STEP = 5

class Drop {
  x: number
  step: number
  speed: number

  constructor(x: number) {
    this.x = x
    this.step = MAX_STEP
    this.speed = 0.25 + Math.random() * 1.25
  }
}

class Matrix {
  private offset = 0
  private pixelData: number[][]
  private width: number
  private height: number
  private drops = new Array<Drop>()

  constructor(width: number, height: number) {
    this.width = width
    this.height = height
    this.pixelData = new Array(this.height).fill(0).map(() =>new Array(this.width).fill(0))
  }

  createDrop() {
    const count = Math.floor(Math.random() * 8)
    for (let i = 0; i < count; i++) {
      const x = Math.floor(Math.random() * this.width)
      this.drops.push(new Drop(x))
    }
  }

  getNext(): number[][] {
    // Move one line down
    this.pixelData.pop()
    this.pixelData.unshift(new Array(this.width).fill(0))

    if (this.offset % 2 === 0) {
      this.createDrop()
    }

    this.drops.forEach((d) => {
      this.pixelData[0][d.x] = Math.floor(0xFF * (d.step / MAX_STEP)) << 16
    })

    this.offset++

    this.drops.forEach((d, i) => {
      d.step -= d.speed
      // TODO: Fix this, this is really bad
      if (d.step <= 0) {
        this.drops.splice(i, 1)
      }
    })

    return this.pixelData
  }
}

export default Matrix
