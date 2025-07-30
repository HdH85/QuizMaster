module.exports = (sequelize, Sequelize) => {
    const Answer = sequelize.define("answer", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        answer: {
            type: Sequelize.STRING,
            allowNull: false
        },
        time: {
            type: Sequelize.INTEGER,
            allowNull: false
        }
    });
    
    Answer.associate = (db) => {
        Answer.belongsTo(db.question);
    }

    return Answer;
}