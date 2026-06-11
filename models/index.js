const Sequelize = require('sequelize');

const connection = {
    host: process.env.HOST,
    dialect: process.env.DIALECT,
    port: process.env.DB_PORT,
    username: process.env.ADMIN_USERNAME,
    password: process.env.ADMIN_PASSWORD,
    database: process.env.DB_NAME,
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    }
};

const sequelize = new Sequelize(connection);
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
