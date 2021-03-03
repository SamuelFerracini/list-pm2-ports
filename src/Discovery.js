const Util = require('./Util')
const Shell = require('./Shell')

class Discovery {
  _util
  _shell

  constructor() {
    this._util = new Util()
    this._shell = new Shell()
  }

  async _getPortFromEnv(envPath) {
    const rawString = await this._shell.exec(`cat ${envPath}`)
    const splited = rawString.split('\n')
    const [rawPort] = splited.filter((x) => x.includes('PORT'))

    if (!rawPort) return

    const port = rawPort.substring(rawPort.indexOf('=') + 1, rawPort.length)

    return +this._util.onlyNumbers(port)
  }

  async getApplicationPorts(paths) {
    const ports = []

    await Promise.all(
      paths.map(async (path) => {
        const envPath = `${path}/.env`
        const exists = await this._shell.checkFileExists(envPath)

        if (exists) {
          const port = await this._getPortFromEnv(envPath)
          ports.push({ port, path })
        } else {
          console.log(`File .env not found in ${envPath}`)
        }
      })
    )

    return ports
  }
}

module.exports = Discovery
