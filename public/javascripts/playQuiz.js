import { Quiz } from './sessionManager.js';
import { startTimer } from './timer.js';

document.addEventListener("DOMContentLoaded", async () => {
    const quiz = new Quiz(quizId);
    const quizContainer = document.getElementById('quizContainer');

    function renderQuiz(quiz) {
        switch (quiz.phase) {
            case 'quizzing':
                quizContainer.innerHTML = `
                    <p class="quizText">${quiz.getCurrentQuestion().question}</p>
                    <p id="timer"></p>
                    <p>
                        <a href="/quiz/${quizId}">
                            <button class="gameButton">Quit</button>
                        </a>
                    </p>
                    `;
                break;
            case 'answers':
                quizContainer.innerHTML = `
                    <p class="quizText">${quiz.getCurrentQuestion().answer}</p>
                    <p>
                        <a href="/quiz/${quizId}">
                            <button class="gameButton">Quit</button>
                        </a>
                    </p>
                    `;
                break;
            case 'finished':
                quizContainer.innerHTML = `
                    <h3>Congratulations! Quiz done!</h3>
                    <p></p>
                    <p>
                        <a href="/quiz/${quizId}">
                            <button class="gameButton">Quit</button>
                        </a>
                    </p>
                    `;
                break;
            default:
                quizContainer.innerHTML = `<button id="playQuiz" class="gameButton">Play</button>`;
            }
    }

    renderQuiz(quiz)

    const startQuizButton = document.getElementById("playQuiz");

    if(startQuizButton) {
        startQuizButton.addEventListener('click', async () => {
            await quiz.startQuiz();
            renderQuiz(quiz);
            
            function tick(formattedTime, timeRemaining) {
                const countdown = document.getElementById("timer");
                if (countdown) {
                    countdown.textContent = formattedTime;
                    countdown.className='';
                    if (timeRemaining <= 30 && timeRemaining > 10) {
                        countdown.classList.add('yellowTimer');
                    } else if (timeRemaining <= 10) {
                        countdown.classList.add('redTimer');
                    }
                }
                if (timeRemaining <= 0 && quiz.hasNextQuestion()) {
                    quiz.nextQuestion();
                    renderQuiz(quiz);
                    startTimer(quiz.getCurrentQuestion().time * 60, tick);
                } else if (timeRemaining <= 0) {
                    quiz.phase = 'answers';
                    quiz.currentQuestion = 0;
                    renderQuiz(quiz);

                    function answerTick(formattedTime, timeRemaining) {
                        const countdown = document.getElementById("timer");
                        if (countdown) countdown.textContent = formattedTime;
                        if (timeRemaining <= 0) {
                            if (quiz.hasNextAnswer()) {
                                quiz.nextAnswer();
                                renderQuiz(quiz);
                                startTimer(20, answerTick);
                                } else {
                                    quiz.phase = 'finished';
                                    renderQuiz(quiz);
                                }
                            }
                        }
                    
                    startTimer(20, answerTick);
                        
                    }
                }

            startTimer(quiz.getCurrentQuestion().time * 60, tick);
        });
    }
});