const Quiz = require('./sessionManager.js');
const question = require("./quizManager");
import { getQuestionData, getAnswerData } from './quizData.js';

class QuizManager {
    constructor(quizId) {
        this.quiz = new Quiz(quizId);
    }
    
    async launchQuiz() {
        try {
            await this.quiz.startQuiz();
            await this.startCurrentQuestion();
        } catch (error) {
            console.error(error.message);
        }
    } 
    
    async startCurrentQuestion() {
        try {
            const question = await this.quiz.getCurrentQuestion();
            if (!question) {
                return;
            }
            const questionData = await getQuestionData(question.id);
            const timeInSeconds = questionData.time * 60;
            
            this.quiz.timer = startTimer(timeInSeconds, 
                this.questionTimerEnded.bind(this), 
                this.questionTimerTick.bind(this));
        } catch (error) {
            console.error(error.message);       
        }
    }
    
    async questionTimerEnded() {
        const nextQuestion = await this.quiz.nextQuestion();
        if (nextQuestion) {
            await this.startCurrentQuestion();
        } else {
            await this.displayAnswers();
        }
    }
    
    questionTimerTick(formattedTime, remaining) {
        const timer = document.getElementById('timer');
        timer.innerHTML = formattedTime;
        if (timer <= 30000) {
            timer.style.color = 'yellow';
        } else if (time <= 15000){
            timer.style.color = 'red';
        } else {
            timer.style.color = 'white';
        }
        console.log(
            'Formatted time:', formattedTime,
            'Remaining time:', remaining
        )
        
        console.log(formattedTime, remaining);
    }
    
    async displayAnswers() {
        try {
            for (let i = 0; i < this.quiz.questions.length; i++) {
                const question = this.quiz.questions[i];
                const answerData = await getAnswerData(question.id);
                console.log(questionData, answerData, answer);
            }
        } catch (error) {
            console.error(error.message);
        }
    }
    
    async theEnd() {
        stopTimer(this.quiz.timer);
    }
}

module.exports = QuizManager;