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
    
    Question.associate = (models) => {
        Question.belongsTo(models.quiz, {
            foreignKey: 'quizId',
            as: 'quiz',
            onDelete: 'CASCADE'       
        });
        Question.hasOne(models.answer);
    }

    return Question;
}