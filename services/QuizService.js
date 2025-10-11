const db = require('../models');

class QuizService {
    constructor() {
        this.client = db.sequelize;
        this.quiz = db.quiz;
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
            const quiz = await this.quiz.findByPk(id);
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
            const quiz = await this.quiz.create({
                title: data.title,
                description: data.description,
                time: data.time
            });
        } catch (error) {
            throw new Error('Error creating quiz: ' + error.message);
        }
    }
}

module.exports = QuizService;