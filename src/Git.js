const Shell = require('./Shell')
const Util = require('./Util')

class Git {
  _GIT_CONFIG_FILE_PATH = '.git/config'

  _shell
  _util

  constructor() {
    this._shell = new Shell()
    this._util = new Util()
  }

  async getGitReferenceByPath(path) {
    const filePath = `${path}/${this._GIT_CONFIG_FILE_PATH}`

    const exists = await this._shell.checkFileExists(filePath)

    if (exists) {
      const raw = await this._shell.exec(`grep -i 'url' ${filePath}`)

      const [_, url] = this._util.splitAndSanatize(raw, '=')

      return url
    }
  }
}

module.exports = Git
