const Shell = require('./Shell')
const Pm2 = require('./Pm2')
const Nginx = require('./Nginx')
const Discovery = require('./Discovery')

async function main() {
  const shell = new Shell()
  const pm2 = new Pm2()
  const nginx = new Nginx()
  const discovery = new Discovery()

  const applicationsPaths = await pm2.getAllApplicationsPaths()

  if (applicationsPaths.length === 0) {
    return console.log(
      `There's no application saved in pm2, did you run pm2 save?`
    )
  }

  const ports = []

  await Promise.all(
    applicationsPaths.map(async (path) => {
      const envPath = `${path}/.env`
      const exists = await shell.checkFileExists(envPath)

      if (exists) {
        const port = await discovery.getPortFromEnv(envPath)
        ports.push({ port, path })
      } else {
        console.log(`File .env not found in ${envPath}`)
      }
    })
  )

  const domainPorts = await nginx.getExposedServicesPorts()

  const merged = ports.map(({ port, path }) => {
    const { domain } = domainPorts.find((x) => x.port === port)
    return { domain, path, port }
  })

  return console.table(merged)
}

main()
