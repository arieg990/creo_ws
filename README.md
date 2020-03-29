# CReative Event Orginizer Rest API
Event Oginizer Project
## Spec
- Node.js = v10.16.3
- express.js = 4.16.1
- npm = 6.9.0

## Module List
- express
- passport
- crypto
- node_base64
- sequelize
- mysql2

## Installation

```bash
npm install
```

## Running server
```bash
npm start
```

## Config Database
database already config in config/config
```json
{
	"development": {
    	"username": "root",
    	"password": "root",
    	"database": "db_creo",
    	"host": "127.0.0.1",
    	"dialect": "mysql",
    	"operatorsAliases": false,
    	"secret":"69c3f001cfe625d06d4c2e2377d54a72a5f6dcffbf9f62ab9c0d26a945355403",
    	"tokenLife": 86400000
  	}
}
```

