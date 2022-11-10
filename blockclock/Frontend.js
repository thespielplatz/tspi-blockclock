const app = require('./app')
const VERSION = require('./../package.json').version

const NODE_PORT = process.env.NODE_PORT || 8000

class Frontend {
  constructor() {
    this.app = app
  }

  setActionCallback(callback) {
    this.actionCallback = callback
  }

  start() {
    const self = this

    app.post('/api/action', (req, res) => {
      console.log(req.body)
      if (self.actionCallback) self.actionCallback(req.body)
      res.json('ok').end()
    })


    // ------------------- Spin up express
    app.get('/', (req, res) => {
      res.render('index', {
        title: 'Blockclock',
        version: VERSION
      })
    })

    app.listen(NODE_PORT,() => {
      console.log(`Starting on NODE_PORT: ${NODE_PORT}`)
    })
  }
}

module.exports = Frontend
