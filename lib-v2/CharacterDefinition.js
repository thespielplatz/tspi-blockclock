const charset = require('../lib/charset.js')

class CharacterDefinition {
  static forChar(char) {
    const description = charset[char.toLowerCase()]
    if (description == null) {
      return null
    }
    return new CharacterDefinition(description)
  }

  constructor(description) {
    this.description = description
    this.width = description[0].length
    this.height = description.length
  }
  
  checkPixel(x, y) {
    return !!this.description[y][x]
  }
}

module.exports = CharacterDefinition
