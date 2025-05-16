const crypto = require('crypto')

module.exports = {
  testEnvironment: 'node',
  globals: {
    window: {
      crypto
    }
  }
}
