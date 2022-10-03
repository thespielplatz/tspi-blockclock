const tetris = require('./lib/tetris/tetris.js')
const display = require('../lib/display')

tetris.setup(HEIGHT, WIDTH)
const tetrisDisplay = {
  setPixel: (x, y, c) => {
    display.setPixel(pixelData, y,  HEIGHT - x - 1, c)
  }
}

tetris.start()

tetris.update(1.0 / FPS)
tetris.draw(tetrisDisplay)
socketGames.on('turn', () => {
  tetris.actionTurn()
})
socketGames.on('left', () => {
  tetris.actionLeft()
})
socketGames.on('right', () => {
  tetris.actionRight()
})
socketGames.on('down-pressed', () => {
  tetris.actionDown(true)
})
socketGames.on('down-released', () => {
  tetris.actionDown(false)
})
