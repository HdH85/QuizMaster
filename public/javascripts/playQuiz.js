const Quiz = require('./sessionManager.js');
const quiz = new Quiz(document.getElementById('quizId').value);
import { startTimer, stopTimer } from './timer.js';

document.addEventListener("DOMContentLoaded", async () => {
    const startQuizButton = document.getElementById("startQuiz");

    startQuizButton.addEventListener("click", async () => {
        await quiz.startQuiz();
    });
});