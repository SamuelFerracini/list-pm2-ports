const Util = require('./Util')
const Shell = require('./Shell')

class Discovery {
  _util
  _shell

  constructor() {
    this._util = new Util()
    this._shell = new Shell()
  }

  async getPortFromEnv(envPath) {
    const rawString = await this._shell.exec(`cat ${envPath}`)
    const splited = rawString.split('\n')
    const [rawPort] = splited.filter((x) => x.includes('PORT'))

    if (!rawPort) return

    const port = rawPort.substring(rawPort.indexOf('=') + 1, rawPort.length)

    return +this._util.onlyNumbers(port)
  }
}

module.exports = Discovery
