const mysql = require('mysql');
const mysqldump = require('mysqldump');
const promisify = require('util').promisify;

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
        return new Promise((res, rej) => {
            mysqldump({
                host:     host || '127.0.0.1',
                user:     login,
                password: password,
                database: database,
                dest:     filename // destination file
            }, e => e ? rej(err) : res(true))
        });
    }
}

module.exports.mysqldump = createMysqlDumpClient;