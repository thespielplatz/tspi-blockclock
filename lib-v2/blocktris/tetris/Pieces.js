const GamePiece = require('./GamePiece.js')
const Piece = require('./Piece.js')

class Pieces {
  constructor() {
    this.pieces = []
  }

  add(piece) {
    this.pieces.push(piece)
  }

  getRandomGamePiece(gameWidth) {
    const randomIndex = Math.floor(Math.random() * this.pieces.length)
    const piece = this.pieces[randomIndex]
    const gamePiece = GamePiece.fromPiece(piece)
    gamePiece.x = Math.floor((gameWidth - 2) / 2)
    return gamePiece
  }
}

const pieces = new Pieces()
pieces.push(new Piece(
  0x70FFFF,
  [
    [1],
    [1],
    [1],
    [1],
  ],
))
pieces.push(new Piece(
  0x0000FF,
  [
    [0, 1],
    [0, 1],
    [1, 1],
  ],
))
pieces.push(new Piece(
  0xFFA000,
  [
    [1, 0],
    [1, 0],
    [1, 1],
  ],
))
pieces.push(new Piece(
  0xFFFF00,
  [
    [1, 1],
    [1, 1],
  ],
))
pieces.push(new Piece(
  0x00FF00,
  [
    [1, 0],
    [1, 1],
    [0, 1],
  ],
))
pieces.push(new Piece(
  0xA000FF,
  [
    [1, 0],
    [1, 1],
    [1, 0],
  ],
))
pieces.push(new Piece(
  0xFF0000,
  [
    [0, 1],
    [1, 1],
    [1, 0],
  ],
))

module.exports = pieces
