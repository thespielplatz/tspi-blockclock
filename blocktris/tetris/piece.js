let Piece = {}

Piece.types = []

Piece.types.push([
  [1],
  [1],
  [1],
  [1],
])

Piece.types.push([
  [0, 1],
  [0, 1],
  [1, 1],
])

Piece.types.push([
  [1, 0],
  [1, 0],
  [1, 1],
])

Piece.types.push([
  [1, 1],
  [1, 1],
])

Piece.types.push([
  [1, 0],
  [1, 1],
  [0, 1],
])

Piece.types.push([
  [1, 0],
  [1, 1],
  [1, 0],
])

Piece.types.push([
  [0, 1],
  [1, 1],
  [1, 0],
])



const colors = [0x70FFFF, 0x0000FF, 0xFFA000, 0xFFFF00, 0x00FF00, 0xA000FF, 0xFF0000]


Piece.create = (gameWidth = 5) => {
  let p = {}

  p.type = Math.floor(Math.random() * Piece.types.length)
  p.form = Piece.types[p.type]
  p.color = colors[p.type]
  p.orientation = 0
  p.x = Math.floor((gameWidth - 2) / 2)
  p.y = 0

  return p
}

module.exports = Piece
