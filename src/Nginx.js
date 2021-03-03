const Shell = require('./Shell')
const Util = require('./Util')

const NGINX_PATH = '/etc/nginx/conf.d/'

class Nginx {
  shell
  util

  constructor() {
    this.shell = new Shell()
    this.util = new Util()
  }

  async getNginxConfigFiles() {
    const raw = await this.shell.exec(`ls ${NGINX_PATH}`)
    return this.util.splitAndSanatize(raw)
  }

  async getExposedServicesPorts() {
    const files = await this.getNginxConfigFiles()

    const domainPorts = []

    await Promise.all(
      files.map(async (file) => {
        const exists = await this.shell.checkFileExists(`${NGINX_PATH}/${file}`)

        if (exists) {
          const rawConfigFile = await this.shell.exec(
            `grep -i 'server_name\\|proxy_pass' ${NGINX_PATH}/${file}`
          )

          const [rawDomain, rawPort] = this.util.splitAndSanatize(rawConfigFile)

          const [_, domain] = rawDomain.split(' ')
          const [__, port] = rawPort.split(' ')

          domainPorts.push({
            domain: domain.substr(0, domain.length - 1),
            port: this.util.onlyNumbers(port)
          })
        }
      })
    )

    return domainPorts
  }
}

module.exports = Nginx
