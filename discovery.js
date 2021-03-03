const functions = require('./functions')
const shell = require('./shell')

async function getPortFromEnv(envPath){
    const rawString = await shell.exec(`cat ${envPath}`)
    const splited = rawString.split('\n')
    const [rawPort] = splited.filter(x => x.includes('PORT'))

    if (!rawPort) return

    const port = rawPort.substring(rawPort.indexOf('=') + 1, rawPort.length)

    return +functions.onlyNumbers(port)
}

module.exports = {
    getPortFromEnv
}