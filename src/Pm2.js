const Shell = require('./Shell')

class Pm2 {
  _shell

  constructor() {
    this._shell = new Shell()
  }

  async getAllApplicationsPaths() {
    const currentUser = await this._shell.exec('whoami')

    const raw = await this._shell.exec(`cat /home/${currentUser}/.pm2/dump.pm2`)

    let applications = []

    try {
      applications = JSON.parse(raw)
    } catch {
      throw new Error(`PM2 file content is not valid`)
    }

    if (!applications.length) throw new Error(`PM2 file content is not valid`)

    return applications.map(({ env }) => env.PWD)
  }
}

module.exports = Pm2
