function sanatizeString(string) {
    return string.trim()
}

function onlyNumbers(string) {
    return string.replace(/^\D+/g, '')
}

module.exports = {
    sanatizeString,
    onlyNumbers
}