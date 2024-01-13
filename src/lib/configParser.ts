import 'dotenv/config'

export type Config = {
  WS281X: {
    brightness: number
  }
}

const getConfig = (): Config => {
  return {
    WS281X: {
      brightness: Number(process.env.WS281X_BRIGHTNESS) || 50
    }
  }
}
export default getConfig
