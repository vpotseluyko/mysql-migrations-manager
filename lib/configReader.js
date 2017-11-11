const path = require('path');
const fs = require('fs');

function ConfigParser() {
    const awaitedConfigPath = path.resolve(process.cwd(), 'migrator.conf.js');
    if (!fs.existsSync(awaitedConfigPath)) {
        throw new Error(`File ${awaitedConfigPath} not found`)
    }
    const config = require(awaitedConfigPath);
    config.host = config.host || '127.0.0.1';
    return config;
}

module.exports = ConfigParser;