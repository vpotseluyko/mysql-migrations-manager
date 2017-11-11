module.exports = {

    // if null left is localhost
    host: null,

    database: '',

    login: 'root',

    password: '',

    /**
     * table where migrator will store it's update logs
     */
    table: 'migrations',

    /**
     * folder where migrations file must be found
     */
    migrationsFolder: 'migrations',

    /**
     * folder where migrator shall store DB backups
     */
    backupsFolder: 'backups',

    /**
     * if turned on migrator will base on numbers in filenames.
     * Format of names it totally up to you, be careful!
     */
    flashDepenedingOnFilename: true,

    /**
     * Array of migrations files with order
     * Only names of files with extensions must be placed here.
     * Is used only when flashDepenedingOnFilename is false
     */
    migrations: [
        '1a.sql',
        '2b.sql',
        'b3.sql',
        'a4.sql'
    ]
};
