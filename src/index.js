const Shell = require('./Shell')
const Pm2 = require('./Pm2')
const Nginx = require('./Nginx')
const Discovery = require('./Discovery')
const Git = require('./Git')

class App {
  _shell
  _pm2
  _nginx
  _discovery
  _git

  constructor() {
    this._shell = new Shell()
    this._pm2 = new Pm2()
    this._nginx = new Nginx()
    this._discovery = new Discovery()
    this._git = new Git()
  }

  async main() {
    const paths = await this._pm2.getAllApplicationsPaths()

    if (paths.length === 0) {
      return console.log(
        `There's no application saved in pm2, did you run pm2 save?`
      )
    }

    const applications = await this._discovery.getApplicationPorts(paths)

    const domainPorts = await this._nginx.getExposedServicesPorts()

    const merged = await Promise.all(
      applications.map(async ({ port, path }) => {
        const found = domainPorts.find((x) => x.port === port)

        let domain

        if (found) domain = found.domain

        const gitUrl = await this._git.getGitReferenceByPath(path)

        return { port, domain, path, gitUrl }
      })
    )

    return console.table(merged)
  }
}

new App().main()
