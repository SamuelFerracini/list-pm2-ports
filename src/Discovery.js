const Util = require('./Util')
const Shell = require('./Shell')

class Discovery {
  util
  shell

  constructor() {
    this.util = new Util()
    this.shell = new Shell()
  }

  async getPortFromEnv(envPath) {
    const rawString = await this.shell.exec(`cat ${envPath}`)
    const splited = rawString.split('\n')
    const [rawPort] = splited.filter((x) => x.includes('PORT'))

    if (!rawPort) return

    const port = rawPort.substring(rawPort.indexOf('=') + 1, rawPort.length)

    return +this.util.onlyNumbers(port)
  }
}

module.exports = Discovery
