let Piece = {}

Piece.types = []

Piece.types.push([
  [1],
  [1],
  [1],
  [1],
])

Piece.types.push([
  [1, 0],
  [1, 0],
  [1, 1],
])

Piece.types.push([
  [0, 1],
  [0, 1],
  [1, 1],
])

Piece.types.push([
  [1, 0],
  [1, 1],
  [1, 0],
])

Piece.types.push([
  [1, 0],
  [1, 1],
  [0, 1],
])

Piece.types.push([
  [0, 1],
  [1, 1],
  [1, 0],
])

Piece.types.push([
  [1, 1],
  [1, 1],
])

Piece.create = () => {
  let p = {}

  p.type = Math.floor(Math.random() * Piece.types.length)
  p.form = Piece.types[p.type]
  p.orientation = 0
  p.x = 1
  p.y = 0

  return p
}

module.exports = Piece
