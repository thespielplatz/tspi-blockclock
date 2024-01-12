const checkReversed = () => {
  if (Uint32Array.prototype.toReversed !== undefined) {
    return
  }

  Uint32Array.prototype.toReversed = function() {
    const rotatedArray = new Uint32Array(this.length)
    this.forEach((v, i) => {
      rotatedArray[this.length - 1 - i] = v
    })
    return rotatedArray
  }
}

module.exports = {
  checkReversed
}
