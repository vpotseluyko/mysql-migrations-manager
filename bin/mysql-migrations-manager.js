const configReader = require('./../src/configReader');
const mysqlClient = require('./../src/mysqlClient');
const defaultStructure = require('./../src/defaultStructure');
const migrationsReader = require('./../src/migrationsReader');
const executor = require('./../src/executor');

(async () => {
    try {
        const config = configReader();

        const mysql = mysqlClient(config.host, config.database, config.login, config.password);

        const mdump = mysqlClient.mysqldump(config.host, config.database, config.login, config.password);

        const version = await defaultStructure(mysql, config.table);

        const migrations = [];
        if (config.flashDepenedingOnFilename) {
            migrationsReader.auto(migrations, config.migrationsFolder);
        } else {
            migrationsReader.provided(migrations, config.migrationsFolder, config.migrations);
        }
        console.log(migrations);

        await executor(version, migrations, mysql, mdump);

        process.exit(0);
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
})();