const { sequelize } = require('../models');
const { QueryTypes } = require('sequelize');

class AnswerService {
    constructor(db) {
        this.client = db.sequelize;
        this.Answer = db.answer;
    }
    
    async getAllAnswers() {
        try {
            const answers = await this.Answer.findAll();
            return answers;
        } catch (error) {
            throw new Error('Error fetching answers: ' + error.message);
        }
    }
    
    async getAnswerById(id) {
        try {
            const answer = await this.Answer.findByPk(id);
            if (!answer) {
                return new Error('Answer not found');
            }
            return answer;
        } catch (error) {
            throw new Error('Error fetching answer: ' + error.message);
        }
    }
    
    async editAnswer(id, answerData) {
        try {
            const answer = await this.Answer.findByPk(id);
            if (!answer) {
                return new Error('Answer not found');
            }
            const updatedAnswer = await answer.update({
                answer: answerData.answer
            });
            return updatedAnswer;
        } catch (error) {
            throw new Error('Error updating answer: ' + error.message);
        }
    }
    
    async deleteAnswer(id) {
        try {
            const answer = await this.Answer.findByPk(id);
            if (!answer) {
                return new Error('Answer not found');
            }
            await answer.destroy();
            return answer;
        } catch (error) {
            throw new Error('Error deleting answer: ' + error.message);
        }
    }
}

module.exports = AnswerService;