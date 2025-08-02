module.exports = {sequelize, Sequelize} => {
    const Quiz = sequelize.define("quiz", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false
        }
    });
    Quiz.associate = (models) => {
        Quiz.hasMany(models.question);
        Quiz.belongsToOne(models.user, {
            foreignKey: 'userId',
            as: 'user',
            onDelete: 'CASCADE'
        });
    }
    
    return Quiz;
}