const shell = require('./shell')

async function getAllApplicationsPaths() {
    const currentUser = await shell.exec('whoami')

    const raw = await shell.exec(`cat /home/${currentUser}/.pm2/dump.pm2`)

    let applications = []

    try {
        applications = JSON.parse(raw)
    } catch {
        throw new Error(`PM2 file content is not valid`)
    }

    if (!applications.length) throw new Error(`PM2 file content is not valid`)

    return applications.map(({ env }) => env.PWD)
}

module.exports = {
    getAllApplicationsPaths
}