const db = require('../models');

class QuizService {
    constructor() {
        this.client = db.sequelize;
        this.quiz = db.quiz;
        this.question = db.question;
    }
    
    async getAllQuizzes() {
        try {
            const quizzes = await this.quiz.findAll();
            return quizzes;
        } catch (error) {
            throw new Error('Error fetching quizzes: ' + error.message);
        }
    }
    
    async getQuizById(id) {
        try {
            const quiz = await this.quiz.findByPk(id, {
                include: [{ 
                    model: this.question, 
                    as: 'questions' 
                }]
            });
            if (!quiz) {
                return new Error('Quiz not found');
            }
            return quiz;
        } catch (error) {
            throw new Error('Error fetching quiz: ' + error.message);
        }
    }
    
    async createQuiz(data) {
        try {
            const result = await this.client.transaction(async (t) => {
                const newQuiz = await this.quiz.create({
                    name: data.name
                }, { transaction: t });

                if (data.questions && Array.isArray(data.questions)) {
                    const questionsData = data.questions.map(q => ({
                        question: q.question,
                        answer: q.answer,
                        time: q.time,
                        quizId: newQuiz.id
                    }));
                    await this.question.bulkCreate(questionsData, { transaction: t });
                }
                return newQuiz;
            });
            return result;
        } catch (error) {
            throw new Error('Error creating quiz: ' + error.message);
        }
    }
    
    async editQuizName(id, data) {
        try {
            const quiz = await this.quiz.findByPk(id);
            if(!quiz) {
                return new Error('Quiz not found');
            }
            
            const updatedQuizName = await this.quiz.update({
                name: data.name
            });
        } catch (error) {
            throw new Error('Error updating quiz name: ' + error.message);
        }
    }

    async deleteQuiz(id) {
        try {
            const quiz = await this.quiz.findByPk(id);
            if(!quiz) {
                return new Error('Quiz not found');
            }
            await db.sequelize.transaction(async (t) => {
                await this.question.destroy({
                    where: { quizId: id }
                }, { transaction: t });
                await this.quiz.destroy({
                    where: { id: id }
                }, { transaction: t });
            });

            return ({ message: 'Quiz deleted successfully' });
            
        } catch (error) {
            throw new Error('Error deleting quiz: ' + error.message);
        }
    }
}

module.exports = QuizService;