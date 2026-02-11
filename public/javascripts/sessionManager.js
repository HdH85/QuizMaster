import { quizAllQuestions } from './quizData.js';
class Quiz {
    constructor(quizId) {
        this.quizId = quizId;
        this.currentQuestion = 0;
        this.phase = 'waiting';
    }
    
    async startQuiz() {
        this.questions = await quizAllQuestions(this.quizId);
        this.phase = 'quizzing';
    }
    
    async getCurrentQuestion() {
        return this.questions[this.currentQuestion];
    }
    
    async nextQuestion() {
        if (await this.hasNextQuestion()) {
            this.currentQuestion++;
            return true;
        }
        return false;
    }

    async hasNextQuestion() {
        return this.currentQuestion + 1 < this.questions.length;
    }
    
    async answers() {
        this.phase = 'answers';
        this.currentQuestion = 0;
    }
}

module.exports = Quiz;