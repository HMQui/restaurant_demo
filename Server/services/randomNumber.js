const cripto = require('crypto')

const generateRandomNumber = () => {
    return cripto.randomInt(100000, 999999).toString()
}

module.exports = generateRandomNumber
