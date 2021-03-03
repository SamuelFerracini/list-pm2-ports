const Shell = require('./Shell')
const Util = require('./Util')

class Nginx {
  NGINX_PATH = '/etc/nginx/conf.d/'

  _shell
  _util

  constructor() {
    this._shell = new Shell()
    this._util = new Util()
  }

  async _getNginxConfigFiles() {
    const raw = await this._shell.exec(`ls ${this.NGINX_PATH}`)
    return this._util.splitAndSanatize(raw)
  }

  async getExposedServicesPorts() {
    const files = await this._getNginxConfigFiles()

    const domainPorts = []

    await Promise.all(
      files.map(async (file) => {
        const exists = await this._shell.checkFileExists(
          `${NGINX_PATH}/${file}`
        )

        if (exists) {
          const rawConfigFile = await this._shell.exec(
            `grep -i 'server_name\\|proxy_pass' ${NGINX_PATH}/${file}`
          )

          const [rawDomain, rawPort] = this._util.splitAndSanatize(
            rawConfigFile
          )

          const [_, domain] = rawDomain.split(' ')
          const [__, port] = rawPort.split(' ')

          domainPorts.push({
            domain: domain.substr(0, domain.length - 1),
            port: this._util.onlyNumbers(port)
          })
        }
      })
    )

    return domainPorts
  }
}

module.exports = Nginx
