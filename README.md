**Mygrator**

Mygrator is console tool for working with mysql migrations in node.js based projects.
It's written for node 8+ and depends on `mysql` package.

Features:
- Config in files
- Migrations are stored in sql files
- Before applying each migration whole DB backup is done
- You can restore backuped DB versions in one line
- If version is placed in migration filename mygrator can resolve versioninf in auto mode. Or you can manually list them in config
- Backup and restore are based on `mysqldump` and `mysql`. They work *really* fast

Warning:
 It's a very young project. No tests and warranties are provided with it. I will be really pleased for any PR and help.

**Start**
```bash
npm i -g mygrator
```  
**Create config template in working dir**
```bash
mygrator setup
```
config is shipped with comments

**List all migrations available**
```bash
mygrator list all
```

**List new migrations**
```bash
mygrator list new
```

**Upgrade DB to latest migration**
```bash
mygrator upgrade
```

**Upgrade DB to specific version**
```bash 
mygrator upgrade 1
# put your version number instead 1
```

**Backup current DB**
```bash 
mygrator backup
```

**Show info about current version**
```bash 
mygrator info
```

**Restore specific version**
```bash
mygrator restore 1
```
