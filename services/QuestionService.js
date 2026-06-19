const db = require('../models');

class QuestionService {
    constructor() {
        this.client = db.sequelize;
        this.question = db.question;
        this._questionHasQuizId = null;
    }

    async _hasQuizId() {
        if (this._questionHasQuizId !== null) {
            return this._questionHasQuizId;
        }

        const questionSchema = await this.client.getQueryInterface().describeTable('questions');
        this._questionHasQuizId = Boolean(questionSchema.quizId);
        return this._questionHasQuizId;
    }

    async createQuestion(data) {
        try {
            const hasQuizId = await this._hasQuizId();
            const payload = {
                question: data.question,
                answer: data.answer,
                time: data.time
            };

            if (hasQuizId && data.quizId !== undefined) {
                payload.quizId = data.quizId;
            }

            const question = await this.question.create(payload);
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
            return updatedQuestion;
        } catch (error) {
            throw new Error('Error updating question: ' + error.message);
        }
    }

    async getAllQuestions(id) {
        try {
            const hasQuizId = await this._hasQuizId();
            const questions = hasQuizId
                ? await this.question.findAll({ where: { quizId: id } })
                : await this.question.findAll();
            return questions;
        } catch (error) {
            throw new Error('Error fetching questions: ' + error.message);
        }
    }

    async getAllAnswers(id) {
        try {
            const hasQuizId = await this._hasQuizId();
            const questions = hasQuizId
                ? await this.question.findAll({ where: { quizId: id } })
                : await this.question.findAll();
            return questions.map((q) => q.answer);
        } catch (error) {
            throw new Error('Error fetching answers: ' + error.message);
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
