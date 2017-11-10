const path = require('path');
const fs = require('fs');

function ConfigParser() {
    const awaitedConfigPath = path.resolve(process.cwd(), process.argv[2]);
    if (!fs.existsSync(awaitedConfigPath)) {
        throw new Error(`File ${awaitedConfigPath} not found`)
    }
    return require(awaitedConfigPath);
}

module.exports = ConfigParser;