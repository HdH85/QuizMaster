import { getQuizData, getAllQuestions, getAllAnswers } from './quizData.js';

class Quiz {
    constructor(quizId) {
        this.quizId = quizId;
        this.questions = [];
        this.answers = [];
        this.currentQuestion = 0;
        this.phase = 'pending';
    }
    
    async startQuiz() {
        this.questions = await getAllQuestions(this.quizId);
        this.answers = await getAllAnswers(this.quizId);
        this.phase = 'quizzing';
        return this.getCurrentQuestion();
    }

    async getQuizName() {
        const quizName = await getQuizData(this.quizId);
        return quizName.name;
    }

    getCurrentQuestion() {
        const question = this.questions[this.currentQuestion];
        return question;
    }

    hasNextQuestion() {
        return this.currentQuestion + 1 < this.questions.length;
    }

    nextQuestion() {
        if (this.hasNextQuestion()) {
            this.currentQuestion++;
            return this.getCurrentQuestion();
        } else {
            this.phase = 'answers';
            this.currentQuestion = 0;
            return null;
        }
    }

    getCurrentAnswer() {
        const answer = this.answers[this.currentQuestion];
        return answer;
    }

    hasNextAnswer() {
        return this.currentQuestion + 1 < this.answers.length;
    }

    nextAnswer() {
        if (this.hasNextAnswer()) {
            this.currentQuestion++;
            return this.getCurrentAnswer();
        } else {
            this.phase = 'finished';
            return null;
        }
    }
}

export { Quiz };