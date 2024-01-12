const checkReversed = () => {
  if (Uint32Array.prototype.toReversed !== undefined) {
    return
  }

  Uint32Array.prototype.toReversed = () => {
    const rotatedArray = new Uint32Array(this.width * this.height)
    this.forEach(i, v => {
      rotatedArray[rotatedArray.length - 1 - i] = v
    })
    return rotatedArray
  }
}

module.exports = {
  checkReversed
}
