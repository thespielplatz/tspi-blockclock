const io = require('socket.io-client')

const defaultOptions = {
  url: null,
  screenId: null,
  onError: (_) => undefined,
}

class SocketGames {
  constructor(options) {
    this._options = Object.assign({}, defaultOptions, options)
    this._callbacks = {
      'controller-connected': [],
      'controller-disconnected': []
    }
  }

  async init() {
    const awaitConnection = new Promise((resolve, reject) => {
      this._resolveConnection = resolve
      this._rejectConnection = reject
    })
    this._socket = io(this._options.url)

    this._socket.on('connect_error', (error) => {
      this._rejectConnection(error)
    })

    this._socket.on('connect_timeout', (timeoutError) => {
      this._rejectConnection(timeoutError)
    })

    // a new controller connected to this screen
    this._socket.on('controller-connected', (controllerId, callback) => {
      this._callbacks['controller-connected'].forEach((callback) => callback(controllerId))
      callback()
    })

    // a controller disconnected from this screen
    this._socket.on('controller-disconnected', (controllerId) => {
      this._callbacks['controller-disconnected'].forEach((callback) => callback(controllerId))
    })

    // controller wraps generic events into "controller-event"
    this._socket.on('controller-event', (eventWrapper, socketCallback) => {
      const { event, data, controllerId } = eventWrapper
      if (this._callbacks[event] == null) {
        return
      }
      this._callbacks[event].forEach((callback) => callback(data, controllerId, socketCallback))
    })

    this._socket.emit('create-screen', this._options.screenId, (data) => {
      if (data.error) {
        this._rejectConnection(data.error)
        return
      }
      this._resolveConnection(data)
    })
    return awaitConnection
  }

  on(event, callback) {
    if (typeof callback !== 'function') {
      return this
    }
    if (this._callbacks[event] == null) {
      this._callbacks[event] = []
    }
    this._callbacks[event].push(callback)
    return this
  }

  emit(event, data, clientId, callback) {
    if (typeof clientId === 'function' || typeof clientId === 'undefined') {
      this.broadcast(event, data, clientId)
      return
    }
    const wrapper = {
      event,
      data,
      clientId,
    }
    this._socket.emit('screen-event', wrapper, callback)
    return this
  }
  
  broadcast(event, data, callback) {
    const wrapper = {
      event,
      data,
    }
    this._socket.emit('screen-event', wrapper, callback)
    return this
  }
}

module.exports = SocketGames
