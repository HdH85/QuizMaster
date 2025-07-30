class QuestionService {
    constructor(db) {
        this.client = db.sequelize;
        this.Question = db.question;
        this.Answer = db.answer;
    }

    async createQuestion(questionData, answerData) {
        try {
            const question = await this.Question.create(questionData);
            const answer = await this.Answer.create({answerData});
            return question && answer;
        } catch (error) {
            throw new Error('Error creating question: ' + error.message);
        }
    }
    
    async asyncEditQuestion(id, questionData) {
        try {
            const question = await this.Question.findByPk(id);
            if (!question) {
                return new Error('Question not found');
            }
            const updatedQuestion = await question.update({
                question: questionData.question,
                time: questionData.time
            });
        } catch (error) {
            throw new Error('Error updating question: ' + error.message);       
        }
    }
    async getAllQuestions() {
        try {
            const questions = await this.Question.findAll();
            return questions;
        } catch (error) {
            throw new Error('Error fetching questions: ' + error.message);
        }
    }

    async getQuestionById(id) {
        try {
            const question = await this.Question.findByPk(id);
            if (!question) {
                return new Error('Question not found');
            }
            return question;
        } catch (error) {
            throw new Error('Error fetching question: ' + error.message);
        }
    }

    async updateQuestion(id, questionData) {
        try {
            const question = await this.Question.findByPk(id);
            if (!question) {
                return new Error('Question not found');
            }
            const updatedQuestion = await question.update({
                question: questionData.question,
                time: questionData.time
            });
            return updatedQuestion;
        } catch (error) {
            throw new Error('Error updating question: ' + error.message);
        }
    }

    async deleteQuestion(id) {
        try {
            const question = await this.Question.findByPk(id);
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