
async function defaultStructure(mysql, table) {

    await mysql.query(
        'CREATE TABLE IF NOT EXISTS ?? (id INT PRIMARY KEY AUTO_INCREMENT, version INT DEFAULT -1)', [table]
    );
    const result = await mysql.query('SELECT * FROM ??', [table]);
    if (!result.length) {
        await mysql.query(`INSERT INTO ??() VALUES ()`, [table])
    }

    return result.length ? result[0].version : -1;

}

module.exports = defaultStructure;