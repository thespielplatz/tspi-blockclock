class Piece {
  // form is a 2D array of 1s and 0s
  // in the form of form[y][x] where y is the row and x is the column
  constructor(color, form) {
    this.color = color
    this.form = form
  }
}

module.exports = Piece
