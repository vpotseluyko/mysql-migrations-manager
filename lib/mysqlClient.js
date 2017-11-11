const mysql = require('mysql');
const mysqldump = require('mysqldump');
const promisify = require('util').promisify;
const {spawn, exec} = require('child_process');
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

module.exports.mysqldump = createMysqlDumpClient;

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


function restoreDump(host, database, login, password) {
    return async function (file) {
        return new Promise((res, rej) => {
            const rebuild_db = `mysql -u ${login} -h ${host} -p${password} ${database} < ${file}`;
            exec(rebuild_db, function (error, stdout, stderr) {
                if (error !== null) {
                    rej(error)
                } else {
                    console.log('Successfully Rebuild Database using: ');
                    console.log('   ' + file);
                    res();
                }
            });
        });
    };
}

module.exports.flashDump = restoreDump;