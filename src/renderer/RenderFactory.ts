import StubRenderer from './StubRenderer'
import WS281xRenderer from './WS281xRenderer'
import IRenderer from './IRenderer'

export default (renderer: string): IRenderer => {
  switch (renderer) {
    case 'ws281x':
      return new WS281xRenderer()
      break

    default:
      return new StubRenderer()
      break
  }
}
