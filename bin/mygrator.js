#!/usr/bin/env node

const configReader = require('./../lib/configReader');
const mysqlClient = require('./../lib/mysqlClient');
const defaultStructure = require('./../lib/defaultStructure');
const migrationsReader = require('./../lib/migrationsReader');
const executor = require('./../lib/executor');
const path = require('path');
const fs = require("fs");

const showHelp = () => {
    console.log('Usage: ');
    console.log('list');
    console.log('      new - show new migrations');
    console.log('      all - show all migrations');
    console.log('          - show all migrations');
    console.log('restore 1 - restores backup for given DB version if exists');
    console.log('upgrade 1 - upgrades DB to given version');
    console.log('upgrade   - upgrades DB to latest available ');
    console.log('          - show all migrations');
    console.log('backup    - backups current DB version');
};

(async () => {
    try {
        const config = configReader();

        const mysql = mysqlClient(config.host, config.database, config.login, config.password);

        const mdump = mysqlClient.mysqldump(config.host, config.database, config.login, config.password);

        const restoreDump = mysqlClient.flashDump(config.host, config.database, config.login, config.password);

        const version = await defaultStructure(mysql, config.table);

        const migrations = [];
        if (config.flashDepenedingOnFilename) {
            migrationsReader.auto(migrations, config.migrationsFolder);
        } else {
            migrationsReader.provided(migrations, config.migrationsFolder, config.migrations);
        }
        // console.log(migrations);

        switch (process.argv[2]) {
            case 'info':
                console.log(`Current db version is ${version}`);
                console.log(version === migrations.length ?
                    `It's up-to-date` : `There are ${migrations.length - version} updates available`
                );
                break;
            case 'list':
                if (process.argv[3] === 'new') {
                    for (let i = 0; i < migrations.length; i++) {
                        if (i + 1 <= version) {
                            migrations.splice(i, 1);
                            i = -1;
                        }
                    }
                }
                if (migrations.length === 0) {
                    console.log('No migrations found');
                } else {
                    migrations.forEach((file) => console.log(`${file.version}: ${file.name}`));
                }
                break;
            case 'restore':
                if (typeof process.argv[3] === 'undefined' || isNaN(parseInt(process.argv[3]))) {
                    console.log('Provide number as a backup version');
                    break;
                }
                const versionToRestore = parseInt(process.argv[3]);
                const filepath = path.resolve(process.cwd(), config.backupsFolder, `DB_v${versionToRestore}_backup.sql`);
                if (!fs.existsSync(path.resolve(filepath))) {
                    console.log('No backup for this version founded. Sorry.');
                    break;
                }
                console.log('Founded needed backup file');
                await restoreDump(filepath);
                break;
            case 'upgrade':
                if (typeof process.argv[3] === 'undefined') {
                    await executor(version, migrations, mysql, mdump, config.backupsFolder, config.table);
                    break;
                }
                if (isNaN(parseInt(process.argv[3]))) {
                    console.log('Provide number as a migrations version');
                    break;
                }
                const versionProvided = parseInt(process.argv[3]);
                if (versionProvided > migrations.length) {
                    console.log(`Latest available migration has version ${version}`);
                    break;
                }
                if (versionProvided < version) {
                    console.log(`DB version couldn't be downgraded`);
                    break;
                }
                for (let i = version; i < migrations.length; i++) {
                    if (i + 1 > versionProvided) {
                        migrations.splice(i, 1);
                        i = version;
                    }
                }
                await executor(version, migrations, mysql, mdump, config.backupsFolder, config.table);
                break;
            case 'backup':
                const backupPath = path.resolve(process.cwd(), config.backupsFolder, `DB_v${version}_backup.sql`);
                console.log(`Starting backup of DB version ${version}`);
                await mdump(backupPath);
                console.log(`Backup saved to ${backupPath}`);
                break;
            default:
                showHelp();
                break;
        }
        process.exit(0);
    } catch (err) {
        console.log('Migrator exited with message:');
        console.error(err.message);
        process.exit(1);
    }
})();