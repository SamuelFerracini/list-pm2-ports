const childProcess = require('child_process')

const Util = require('./Util')

class Shell {
  _util

  constructor() {
    this._util = new Util()
  }

  async exec(command) {
    const rawResult = await this._promisify(command)
    return this._util.sanatizeString(rawResult.toString())
  }

  async checkFileExists(path) {
    try {
      return Boolean(await this._promisify(`cat ${path}`))
    } catch {
      return false
    }
  }

  _promisify(command) {
    return new Promise((resolve, reject) => {
      childProcess.exec(command, { stdio: 'pipe' }, (error, stdout, stderr) => {
        if (error) reject(error)
        resolve(stdout)
      })
    })
  }
}

module.exports = Shell
