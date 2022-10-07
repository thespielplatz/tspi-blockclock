declare module 'socket.io-client' {
  export class Client {
    public on(event: string, callback: CallableFunction): void
    public emit(event: string, data: unknown, callback: CallableFunction | undefined): void
    public connected: boolean
    public disconnected: boolean
    public id: string
  }
  export default (url: string) => new Client
}
