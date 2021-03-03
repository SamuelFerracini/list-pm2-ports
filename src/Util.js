class Util {
  sanatizeString(string) {
    return string.trim()
  }

  splitAndSanatize(array, delimiter = '\n') {
    return array.split(delimiter).map((x) => this.sanatizeString(x))
  }

  onlyNumbers(string) {
    return +string.match(/\d+/)[0]
  }
}

module.exports = Util
