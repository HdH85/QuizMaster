const Sequelize = require('sequelize');
const mySql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
const basename = path.basename(__filename);
require('dotenv').config();

const connection = {
    host: process.env.HOST,
    dialect: process.env.DIALECT,
    port: process.env.PORT,
    username: process.env.ADMIN_USERNAME,
    password: process.env.ADMIN_PASSWORD,
    database: process.env.DB_NAME,
    dialectmodel: process.env.DIALECTMODEL,
};

async function createDbIfNotThere() {
    const {host, port, username, password, database} = connection;

    try {
        const conn = await mySql.createConnection({
            host,
            port,
            user: username,
            password
        });

        await conn.query(
            `CREATE DATABASE IF NOT EXISTS \`${database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`
        );

        console.log(`Database '${database}' is ready.`)
        await conn.end();
    } catch (error) {
        console.error('Error generating database:', error);
        throw error;
    }
}

const dbReady = createDbIfNotThere();

const sequelize = new Sequelize(connection);
const db = {};
db.sequelize = sequelize;
db.ready = dbReady;

fs.readdirSync(__dirname)
    .filter((file) => {
        return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
    })
    .forEach((file) => {
        const model = require(path.join(__dirname, file))(
            sequelize, 
            Sequelize
        );
        db[model.name] = model;
    });
Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

module.exports = db;