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
    
    async asyncEditQuestion(id, data) {
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
    async getAllQuestions() {
        try {
            const questions = await this.question.findAll();
            return questions;
        } catch (error) {
            throw new Error('Error fetching questions: ' + error.message);
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