class GamePiece {
  static fromPiece(piece) {
    return new GamePiece(piece)
  }

  constructor(piece) {
    this.piece = piece
    this.x = 0
    this.y = 0
    this.orientation = 0
    this.deltaMovement = 0
  }

  getCurrentForm() {
    // todo : handle orientation
    return this.piece.form
  }
}

module.exports = GamePiece
