const {sequelize, Sequelize} = require("./quiz");
module.exports = {sequelize, Sequelize} => {
    const User = sequelize.define("user", {
        username: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false
        }
    })
    User.associate = (models) => {
        User.hasMany(models.quiz);
    }
}