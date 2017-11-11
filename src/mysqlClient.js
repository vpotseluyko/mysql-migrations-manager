const mysql = require('mysql');
const mysqldump = require('mysqldump');
const promisify = require('util').promisify;
const spawn = require('child_process').spawn;
const fs = require('fs');
const path = require('path');

function createMysqlClient(host, database, login, password) {
    const client = mysql.createConnection({
        host: host || '127.0.0.1',
        user: login,
        password: password,
        database: database,
        multipleStatements: true
    });

    client.query = promisify(client.query);

    return client
}

module.exports = createMysqlClient;

function createMysqlDumpClient(host, database, login, password) {
    return async function (filename) {
        return new Promise((resolve, reject) => {
            const mysqldump = spawn('mysqldump', [
                '-u', login,
                `-p${password}`,
                database
            ]);
            const file = fs.createWriteStream(path.resolve(process.cwd(), filename));
            mysqldump
                .stdout
                .pipe(file)
                .on('finish', resolve)
                .on('error', e => reject(e));
        })

    }
}

module.exports.mysqldump = createMysqlDumpClient;