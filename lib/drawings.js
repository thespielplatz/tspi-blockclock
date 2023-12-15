const renderLAB10Logo = (display, offsetX = 0) => {
  display.setPixel(offsetX + 0, 0, 0x754eca)
  display.setPixel(offsetX + 1, 0, 0x754eca)
  display.setPixel(offsetX + 0, 1, 0x754eca)
  display.setPixel(offsetX + 0, 2, 0x754eca)
  display.setPixel(offsetX + 0, 3, 0x754eca)
  display.setPixel(offsetX + 0, 4, 0x754eca)
  display.setPixel(offsetX + 1, 4, 0x754eca)
  display.setPixel(offsetX + 2, 1, 0x754eca)

  display.setPixel(offsetX + 2, 4, 0x6249ca)
  display.setPixel(offsetX + 3, 0, 0x6249ca)
  display.setPixel(offsetX + 3, 3, 0x6249ca)
  display.setPixel(offsetX + 3, 4, 0x6249ca)
  display.setPixel(offsetX + 4, 1, 0x6249ca)
  display.setPixel(offsetX + 4, 4, 0x6249ca)

  display.setPixel(offsetX + 5, 0, 0x4341ca)
  display.setPixel(offsetX + 6, 0, 0x4341ca)
  display.setPixel(offsetX + 6, 1, 0x4341ca)
  display.setPixel(offsetX + 6, 2, 0x4341ca)

  display.setPixel(offsetX + 6, 3, 0x744eca)
  display.setPixel(offsetX + 6, 4, 0x744eca)
  display.setPixel(offsetX + 5, 4, 0x744eca)

  display.setPixel(offsetX + 2, 0, 0xFFFFFF)
  display.setPixel(offsetX + 4, 0, 0xFFFFFF)
  display.setPixel(offsetX + 1, 1, 0xFFFFFF)
  display.setPixel(offsetX + 3, 1, 0xFFFFFF)
  display.setPixel(offsetX + 5, 1, 0xFFFFFF)
  display.setPixel(offsetX + 1, 2, 0xFFFFFF)
  display.setPixel(offsetX + 2, 2, 0xFFFFFF)
  display.setPixel(offsetX + 3, 2, 0xFFFFFF)
  display.setPixel(offsetX + 4, 2, 0xFFFFFF)
  display.setPixel(offsetX + 5, 2, 0xFFFFFF)
  display.setPixel(offsetX + 1, 3, 0xFFFFFF)
  display.setPixel(offsetX + 2, 3, 0xFFFFFF)
  display.setPixel(offsetX + 4, 3, 0xFFFFFF)
  display.setPixel(offsetX + 5, 3, 0xFFFFFF)
}

const SateLogo = (display, offsetX = 0) => {
  //display.setPixel(offsetX + 1, 0, 0xee006e)
  display.setPixel(offsetX + 3, 0, 0xfc0052)
  display.setPixel(offsetX + 4, 0, 0xff0736)
  display.setPixel(offsetX + 5, 0, 0xff330a)

  display.setPixel(offsetX + 3, 1, 0xe5027f)

  //display.setPixel(offsetX + 0, 2, 0xdc0587)
  display.setPixel(offsetX + 3, 2, 0xe70078)
  display.setPixel(offsetX + 4, 2, 0xeb0070)
  display.setPixel(offsetX + 5, 2, 0xf4005b)

  display.setPixel(offsetX + 5, 3, 0xf60057)

  //display.setPixel(offsetX + 0, 4, 0x833192)
  //display.setPixel(offsetX + 1, 4, 0x833192)
  display.setPixel(offsetX + 3, 4, 0xbd198a)
  display.setPixel(offsetX + 4, 4, 0xcf0b82)
  display.setPixel(offsetX + 5, 4, 0xde027b)
}

module.exports = {
  renderLAB10Logo,
  SateLogo,
}
