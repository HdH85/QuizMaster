const db = require('../models');
const QuestionService = require('../services/QuestionService.js')
const questionService = new QuestionService(db);

async function startTheCount(id) {
    try {
        const question = await questionService.getQuestionById(id);
        let timer = parseInt(question.time);

        const startTimer = setInterval(function() {
            timer = timer - 1;
            const milliseconds = Math.floor(total % 1000);
            const seconds = Math.floor(total % 60);
            const minutes = Math.floor(total / 60);
            
            if (timer <= 0) {
                clearInterval(startTimer);
            }

            return {
                minutes,
                seconds,
                milliseconds
            };
        }, 1000);
        
    } catch (error) {
        console.log('Countdown error', error);
    }
}