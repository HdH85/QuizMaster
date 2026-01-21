var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var jwt = require('jsonwebtoken');
var QuestionService = require('../services/QuestionService');
var UserService = require('../services/UserService');
var userService = new UserService();
var questionService = new QuestionService();
const { isAuth, isAdmin } = require('../middleware/authMiddleware')
const cookieParser = require('cookie-parser');
const QuizService = require("../services/QuizService");
const quizService = new QuizService();
router.use(cookieParser());

router.get('/', async (req, res, next) => {
    try {
        res.render('quiz', {title: 'Quizmaker', quiz: null });
    } catch (error) {
        console.log(error);
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        const quiz = await quizService.getQuizById(req.params.id);
        res.render('quiz', {title: 'Quizmaker', quiz: quiz});
    } catch (error) {
        console.log(error);
    }
});

router.post('/', jsonParser, async (req, res, next) => {
    try {
        const { name, questions } = req.body;
        if (!name || name.trim() === '') {
            return res.status(400).json({
                success: false,
                statuscode: 400,
                data: {
                    message: 'Quiz name is required'
                }
            });
        }

        if (questions && Array.isArray(questions)) {
            for (const q of questions) {
                if (!q.question || !q.answer || !q.time || q.question.trim() === '' || q.answer.trim() === '' || q.time.trim() === '') {
                    return res.status(400).json({
                        success: false,
                        statuscode: 400,
                        data: {
                            message: 'All questions must have question text, answer and time'
                        }
                    });
                }
            }
        }
        
        const newQuiz = await quizService.createQuiz(req.body);
        return res.status(201).json({
            success: true,
            statuscode: 201,
            data: {
                message: 'Quiz created successfully',
                result: newQuiz
                }
            });

    } catch (error) {
        console.error('Error creating quiz: ', error);
        return res.status(500).json({
            success: false,
            statuscode: 500,
            data: {
                message: error.message
            }
        })
    }
});

module.exports = router;
