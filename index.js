const shell = require('./shell')
const pm2 = require('./pm2')
const discovery = require('./discovery')

async function main() {
    const applicationsPaths = await pm2.getAllApplicationsPaths()

    if (applicationsPaths.length === 0) {
        return console.log(`There's no application saved in pm2, did you run pm2 save?`)
    }

    const promises = applicationsPaths.map(async path => {
        const envPath = `${path}/.env`
        const exists = await shell.checkFileExists(envPath)

        if (exists) {
            const port = await discovery.getPortFromEnv(envPath)
            return { port, path }
        } else {
            console.log(`File .env not found in ${envPath}`)
        }
    })

    const ports = await Promise.all(promises)

    return console.table(ports)
}

main()