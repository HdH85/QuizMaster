const { sequelize } = require('../models');
const { QueryTypes } = require('sequelize');
class QuizService {
    constructor(db) {
        this.client = db.sequelize;
        this.Quiz = db.quiz;
        this.Question = db.question;
        this.Answer = db.answer;
    }
    
    async getAllQuizzes() {
        try {
            const quizzes = await this.Quiz.findAll();
            return quizzes;
        } catch (error) {
            throw new Error('Error fetching quizzes: ' + error.message);
        }
    }
    
    async getQuizById(id) {
        try {
            const quiz = await this.Quiz.findByPk(id);
            if (!quiz) {
                return new Error('Quiz not found');
            }
            return quiz;
        }
    }
    
    async createQuiz(quizData) {
        try {
            const quiz = await this.Quiz.create({
                title: quizData.title,
                description: quizData.description,
                time: quizData.time
            });
        }
    }
}

module.exports = QuizService;