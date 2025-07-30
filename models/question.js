module.exports = (sequelize, Sequelize) => {
    const Question = sequelize.define("question", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        question: {
            type: Sequelize.STRING,
            allowNull: false
        },
        time: {
            type: Sequelize.INTEGER,
            allowNull: false
        }
    });
    
    Question.associate = (db) => {
        Question.hasOne(db.answer);
    }

    return Question;
}