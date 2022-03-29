import StubRenderer from './StubRenderer'
import WS281xRenderer from './WS281xRenderer'
import IRenderer from './IRenderer'
import ConsoleRenderer from './ConsoleRenderer'

export default (renderer: string): IRenderer => {
  console.info(`Starting with renderer ${renderer}`)
  switch (renderer) {
    case 'consolerenderer':
      return new ConsoleRenderer()
      break

    case 'ws281x':
      return new WS281xRenderer()
      break

    default:
      return new StubRenderer()
      break
  }
}
