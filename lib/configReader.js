const path = require('path');
const fs = require('fs');

function ConfigParser() {
    const awaitedConfigPath = path.resolve(process.cwd(), 'migrator.conf.js');
    if (!fs.existsSync(awaitedConfigPath)) {
        throw new Error(`File ${awaitedConfigPath} not found.\n Run mygrator setup to create it`);
    }
    const config = require(awaitedConfigPath);
    config.host = config.host || '127.0.0.1';
    const backups = path.resolve(process.cwd(), config.backupsFolder);
    if (!fs.existsSync(backups)) {
        fs.mkdirSync(backups);
    }
    const migrations = path.resolve(process.cwd(), config.migrationsFolder);
    if (!fs.existsSync(migrations)) {
        fs.mkdirSync(migrations);
    }
    return config;

}

module.exports = ConfigParser;