const { where } = require('sequelize');
const db = require('../models');

class QuestionService {
    constructor() {
        this.client = db.sequelize;
        this.question = db.question;
    }

    async createQuestion(data) {
        try {
            const question = await this.question.create(data)
            return question;
        } catch (error) {
            throw new Error('Error creating question: ' + error.message);
        }
    }
    
    async EditQuestion(id, data) {
        try {
            const question = await this.question.findByPk(id);
            if (!question) {
                return new Error('Question not found');
            }
            const updatedQuestion = await this.question.update({
                question: data.question,
                time: data.time
            });
        } catch (error) {
            throw new Error('Error updating question: ' + error.message);       
        }
    }
    async getAllQuestions(id) {
        try {
            const questions = await this.question.findAll({ where: { quizId: id } });
            return questions;
        } catch (error) {
            throw new Error('Error fetching questions: ' + error.message);
        }
    }

    async getAllAnswers(id) {
        try {
            const questions = await this.question.findAll({ where: { quizId: id } });
            return questions.map(q => q.answer);
        } catch (error) {
            throw new Error('Error fetching answers: ' + error.message)
        }
    }

    async getQuestionById(id) {
        try {
            const question = await this.question.findByPk(id);
            if (!question) {
                return new Error('Question not found');
            }
            return question;
        } catch (error) {
            throw new Error('Error fetching question: ' + error.message);
        }
    }

    async getAnswerById(id) {
        try {
            const question = await this.question.findByPk(id);
            if (!question) {
                return new Error('Answer not found');
            }
            return question.answer;
        } catch (error) {
            throw new Error('Error fetching answer: ' + error.message);
        }
    }

    async updateQuestion(id, data) {
        try {
            const question = await this.question.findByPk(id);
            if (!question) {
                return new Error('Question not found');
            }
            await question.update(data);
            return question;
        } catch (error) {
            throw new Error('Error updating question: ' + error.message);
        }
    }

    async deleteQuestion(id) {
        try {
            const question = await this.question.findByPk(id);
            if (!question) {
                return new Error('Question not found');
            }
            await question.destroy();
            return { message: 'Question deleted successfully' };
        } catch (error) {
            throw new Error('Error deleting question: ' + error.message);
        }
    }
}

module.exports = QuestionService;