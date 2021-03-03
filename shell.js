const childProcess = require('child_process')

const functions = require('./functions')

async function exec(command) {
    const rawResult = await _promisify(command)
    return functions.sanatizeString(rawResult.toString()) 
}

async function checkFileExists(path) {
    try {
        return Boolean(await _promisify(`cat ${path}`))
    } catch {
        return false
    }
}

function _promisify(command) {
    return new Promise((resolve, reject) => {
        childProcess.exec(command, { stdio: 'pipe' }, (error, stdout, stderr) => {
            if (error) reject(error)
            resolve(stdout);
        })
    })
}

module.exports = {
    exec,
    checkFileExists
}