class GamePiece {
  constructor(piece) {
    this.piece = piece
    this.x = 0
    this.y = 0
    this.orientation = 0
  }

  static fromPiece(piece) {
    return new GamePiece(piece)
  }
}
