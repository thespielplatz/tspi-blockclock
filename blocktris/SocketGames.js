const io = require('socket.io-client');

const defaultOptions = {
  url: null,
  screenId: null,
  onConnect: null,
  onError: null,
};

class SocketGames {
  constructor(options) {
    this._options = Object.assign({}, defaultOptions, options);
    this._callbacks = {
      'controller-connected': [],
      'controller-disconnected': []
    };

    this._socket = io(this._options.url);

    this._socket.on('connect_error', (error) => {
      if (this._options.onError) {
        this._options.onError(error);
      }
    });

    this._socket.on('connect_timeout', (timeout) => {
      if (this._options.onError) {
        this._options.onError(timeout);
      }
    });

    this._socket.emit('create-screen', this._options.screenId, (data) => {
      if (data.error) {
        if (this._options.onError) {
          this._options.onError(data.error);
        }
        return;
      }

      // a new controller connected to this screen
      this._socket.on('controller-connected', (controllerId, callback) => {
        this._callbacks['controller-connected'].forEach((callback) => callback(controllerId));
        callback();
      });

      // a controller disconnected from this screen
      this._socket.on('controller-disconnected', (controllerId) => {
        this._callbacks['controller-disconnected'].forEach((callback) => callback(controllerId));
      });

      // controller wraps generic events into "controller-event"
      this._socket.on('controller-event', (eventWrapper, socketCallback) => {
        const { event, data, controllerId } = eventWrapper;
        if (!this._callbacks[event]) {
          return;
        }
        this._callbacks[event].forEach((callback) => callback(data, controllerId, socketCallback));
      });

      if (this._options.onConnect) {
        this._options.onConnect(data);
      }
    });
  }

  on(event, callback) {
    if (typeof callback !== 'function') {
      return this;
    }
    if (!this._callbacks[event]) {
      this._callbacks[event] = [];
    }
    this._callbacks[event].push(callback);
    return this;
  }

  emit(event, data, clientId, callback) {
    if (typeof clientId === 'function' || typeof clientId === 'undefined') {
      this.broadcast(event, data, clientId);
      return;
    }
    let wrapper = {
      event,
      data,
      clientId,
    };
    this._socket.emit('screen-event', wrapper, callback);
    return this;
  }
  
  broadcast(event, data, callback) {
    let wrapper = {
      event,
      data,
    };
    this._socket.emit('screen-event', wrapper, callback);
    return this;
  }
}

module.exports = SocketGames;
