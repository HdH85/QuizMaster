const Sequelize = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
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
