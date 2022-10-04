import io, { type Client } from 'socket.io-client'

type options = {
  url: string
  screenId: string
  onConnect: (data: unknown) => void
  onError: (error: unknown) => void
}

export default class SocketGames {
  url: string
  screenId: string
  onConnect: (data: unknown) => void
  onError: (error: unknown) => void
  socket: Client
  callbacks: Record<string, CallableFunction[]>

  constructor(options: options) {
    this.url = options.url
    this.screenId = options.screenId
    this.onConnect = options.onConnect
    this.onError = options.onError
    this.socket = io(this.url)
    this.callbacks = {
      'screen-disconnected': []
    }

    this.socket.on('connect_error', (error: unknown) => this.onError(error))
    this.socket.on('connect_timeout', (error: unknown) => this.onError(error))
    this.socket.emit('join-screen', this.screenId, (data: any) => {
      if (data.error) {
        this.onError(data.error)
        return
      }

      this.socket.on('screen-disconnected', () => {
        this.callbacks['screen-disconnected'].forEach((callback) => callback())
      })

      this.socket.on('screen-event', (eventWrapper: any, socketCallback: CallableFunction) => {
        const { event, data } = eventWrapper
        if (!this.callbacks[event]) {
          return
        }
        this.callbacks[event].forEach((callback) => callback(data, socketCallback))
      })

      this.onConnect(data)
    })
  }

  on(event: string, callback: CallableFunction) {
    if (typeof callback !== 'function') {
      return this
    }
    if (!this.callbacks[event]) {
      this.callbacks[event] = []
    }
    this.callbacks[event].push(callback)
    return this
  }

  emit(event: string, data?: unknown, callback?: CallableFunction) {
    let wrapper = {
      event,
      data,
    }
    this.socket.emit('controller-event', wrapper, callback)
    return this
  }
}
