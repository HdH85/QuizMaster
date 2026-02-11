import { quizAllQuestions } from './quizData.js';
class Quiz {
    constructor(quizId) {
        this.quizId = quizId;
        this.questions = [];
        this.currentQuestion = 0;
        this.timer = null;
        this.phase = 'loading';
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
    
    async answers() {
        this.phase = 'answers';
        this.currentQuestion = 0;
    }
}

module.exports = Quiz;