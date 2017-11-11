const path = require('path');


async function executor(version, migrations, mysql, mdump, backups, table) {
    if (migrations.length === version) {
        console.log(`DB is latest(${version}) version`);
        return true;
    }
    console.log(`Backing up version ${version}`);
    await mdump(path.resolve(process.cwd(), backups, `DB_v${version}_backup.sql`));
    console.log(`Backup of version ${version} is ready`);
    console.log(`Flashing migration(${migrations[version].name}): update DB to version ${version + 1}`);
    await mysql.query(migrations[version].content);
    console.log(`Migration(${migrations[version].name}) to v${version + 1} applied successfully`);
    console.log(`DB version is now ${++version}`);
    await mysql.query('UPDATE ?? SET?', [table, {version}]);
    console.log('------------------------------------------------------');
    await executor(version, migrations, mysql, mdump, backups, table);
}

module.exports = executor;