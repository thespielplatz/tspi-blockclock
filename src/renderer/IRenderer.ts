interface IRenderer {
  init: (numLeds: number, brightness: number) => void
  deinit: () => void
  render: (colors: number[]) => void
}

export default IRenderer
