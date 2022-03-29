class Rainbow {
  private offset = 0
  private pixelData: number[]

  constructor(numPixel: number) {
    this.pixelData = new Array(numPixel)
  }

  getNextSingle(): number[] {
    this.offset = (this.offset + 1) % 256
    return this.pixelData.fill(Rainbow.colorwheel(this.offset))
  }

  getNext(): number[] {
    for (let i = 0; i < this.pixelData.length; i++) {
      this.pixelData[i] = Rainbow.colorwheel((this.offset + i) % 256);
    }

    this.offset = (this.offset + 1) % 256
    return this.pixelData
  }
  private static colorwheel(startPos: number) {
    let pos = 255 - startPos
    if (pos < 85) {
      return Rainbow.rgb2Int(255 - pos * 3, 0, pos * 3)
    }
    if (pos < 170) {
      pos -= 85
      return Rainbow.rgb2Int(0, pos * 3, 255 - pos * 3)
    }
    pos -= 170
    return Rainbow.rgb2Int(pos * 3, 255 - pos * 3, 0)
  }

  private static rgb2Int(r: number, g: number, b: number) {
    return ((r & 0xff) << 16) + ((g & 0xff) << 8) + (b & 0xff)
  }
}

export default Rainbow
