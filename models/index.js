const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const pg = require('pg');

function loadDotEnvFile() {
    const envPath = path.resolve(__dirname, '..', '.env');
    if (!fs.existsSync(envPath)) {
        return;
    }

    const lines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/);
    lines.forEach((line) => {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) {
            return;
        }

        const separatorIndex = trimmed.indexOf('=');
        if (separatorIndex === -1) {
            return;
        }

        const key = trimmed.slice(0, separatorIndex).trim();
        if (!key || process.env[key] !== undefined) {
            return;
        }

        let value = trimmed.slice(separatorIndex + 1).trim();
        if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
            value = value.slice(1, -1);
        }

        process.env[key] = value;
    });
}

loadDotEnvFile();

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
    throw new Error('Missing DATABASE_URL. Add DATABASE_URL to your environment or .env file.');
}

const sequelize = new Sequelize(databaseUrl, {
    dialect: 'postgres',
    dialectModule: pg,
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    }
});

const db = {};
db.sequelize = sequelize;

const userModel = require('./user')(sequelize, Sequelize);
const quizModel = require('./quiz')(sequelize, Sequelize);
const questionModel = require('./question')(sequelize, Sequelize);

db[userModel.name] = userModel;
db[quizModel.name] = quizModel;
db[questionModel.name] = questionModel;

Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

module.exports = db;
