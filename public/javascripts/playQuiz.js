import { Quiz } from './sessionManager.js';
import { startTimer, stopTimer } from './timer.js';

document.addEventListener("DOMContentLoaded", async () => {
    const quiz = new Quiz(quizId);
    const quizContainer = document.getElementById('quizContainer');

    function renderQuiz(quiz) {
        switch (quiz.phase) {
            case 'quizzing':
                quizContainer.innerHTML = `
                    <h3>${quiz.name}</h3>
                    <p>${quiz.currentQuestion}</p>
                    `;
                break;
            case 'answers':
                quizContainer.innerHTML = `
                    <h3>${quiz.name}</h3>
                    <p>${quiz.currentQuestion}</p>
                    `;
                break;
            case 'finished':
                quizContainer.innerHTML = `<h3>Congratulations! Quiz done!</h3>`;
                break;
            default:
                quizContainer.innerHTML = `<button id="playQuiz">Play</button>`;
            }
    }

    renderQuiz(quiz)

    const startQuizButton = document.getElementById("playQuiz");

    if(startQuizButton) {
        startQuizButton.addEventListener('click', async () => {
            let currentTimer;
            await quiz.startQuiz();
            renderQuiz(quiz);
            currentTimer = startTimer(quiz.getCurrentQuestion().time, (formattedTime, timeRemaining) => {
                if (timeRemaining <= 0 && quiz.hasNextQuestion()) {
                    quiz.nextQuestion();
                    renderQuiz(quiz);
                    startTimer(quiz.getCurrentQuestion().time);
                } else {
                    stopTimer();
                    renderQuiz(quiz);
                    startTimer(5000, () => {
                        if (quiz.hasNextAnswer()) {
                            quiz.nextAnswer();
                            renderQuiz(quiz);
                            startTimer(5000);
                        } else {
                            stopTimer();
                            renderQuiz(quiz);
                        }
                    });
                }
            });
        });
    }
});