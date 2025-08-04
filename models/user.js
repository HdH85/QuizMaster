module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("user", {
        username: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false
        },
        usertype: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0
        }
    }, {
        timestamps: false,
    });
    User.associate = (models) => {
        User.hasMany(models.quiz);
    }
    
    return User;
}