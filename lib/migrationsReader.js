const path = require('path');
const fs = require('fs');

const replaceAll = (str, search, replace) => str.split(search).join(replace);

Array.prototype.diff = function (a) {
    return this.filter(i => a.indexOf(i) < 0)
};

function migrationsReaderAuto(migrations, folder) {

    const m_folder = path.resolve(process.cwd(), folder);
    const files = (fs.readdirSync(m_folder)).diff(['.', '..']);

    files.forEach(file => {
        migrations.push({
            version: file.match(/\d+/)[0],
            name: file,
            content: replaceAll(
                fs.readFileSync(
                    path.resolve(process.cwd(), m_folder, file)
                ).toString('utf8'), '\n', ' '
            )
        });
    });
    migrations = migrations.sort((a, b) => a.version - b.version);
}

module.exports.auto = migrationsReaderAuto;

function migrationsReaderProvided(migrations, folder, provided) {
    provided.forEach((file, version) => {
        const file_path = path.resolve(process.cwd(), folder, file);
        if (!fs.existsSync(file_path)) throw new Error(`No such file ${file_path}`);
        migrations.push({
            version,
            name: file,
            content: replaceAll(
                fs.readFileSync(file_path).toString('utf8'), '\n', ' '
            )
        });
    });
}

module.exports.provided = migrationsReaderProvided;