import { getApi } from './api.js';

function nextAnswer(id) {
    return getApi('/quiz/' + id, 'GET', null, true)
        .then(res => {
            if (res.success) {
                const answers = res.data.result.answers;
                const currentAnswer = res.data.result.currentAnswer;
                const nextAnswer = answers[currentAnswer + 1];
                return nextAnswer;
                
                if (nextAnswer === undefined) {
                    return "Quiz over, go home!"
                }
            } else {
                throw new Error(res.data.message);       
            }  
        })
}

function nextQuestion(id) {
    return getApi('/quiz/' + id, 'GET', null, true)
    .then(res => {
        if (res.success) {
            const questions = res.data.result.length;
            const startQuestion = res.data.result[0] + 1;
            const endQuestion = res.data.result[howManyQuestions - 1] + 1;
            const nextQuestion = startQuestion + " - " + endQuestion;
            return nextQuestion;
        } else {
            throw new Error(res.data.message);       
        }   
    })
}

function startTheCount(id) {
    return getApi('/questions/' + id, 'GET', null, true)
    .then(res => {
        if (res.success) {
            let timer = parseInt(res.data.result.time);
            const startTimer = setInterval(function() {
                timer = timer - 1;
                const milliseconds = Math.floor(timer % 1000);
                const seconds = Math.floor(timer % 60);
                const minutes = Math.floor(timer / 60);

                if (timer <= 0) {
                    return nextQuestion();
                }
            }, 1000);
            
            return startTimer;
            
        } else {
            throw new Error(res.data.message);
        }
    })
}

export { nextQuestion, startTheCount };