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
})

router.post('/', jsonParser, async (req, res, next) => {
    try {
        const { name } = req.body;
        if (!name || name.trim() === '') {
            return res.status(400).json({
                success: false,
                statuscode: 400,
                data: {
                    message: 'Quiz name is required'
                }
            });
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

router.post('/question', jsonParser, async (req, res, next) => {
    try {
        const {question, answer, time} = req.body;
        if (!question || !answer || !time || question.trim() === '' || answer.trim() === '' || time.trim() === '') {
            return res.status(400).json({
                success: false,
                statuscode: 400,
                data: {
                    message: 'Question, answer and time are required'
                }
            });
        }

        const newQuestion = await questionService.createQuestion(req.body);
        return res.status(201).json({
            success: true,
            statuscode: 201,
            data: {
                message: 'Question created successfully',
                result: newQuestion
                }
            });
    } catch (error) {
        console.error('Error creating question: ', error);
        return res.status(500).json({
            success: false,
            statuscode: 500,
            data: {
                message: error.message
            }
        })
    }
});

router.put('/question/:id', jsonParser, async (req, res, next) => {
    try {
        const questionId = req.params.id;
        const updatedQuestion = await questionService.updateQuestion(questionId, req.body);
        if (!updatedQuestion || updatedQuestion.message === 'Question not found') {
            return res.status(400).json({
                success: false,
                statuscode: 400,
                data: {
                    message: 'Question not found'
                }
            });
        } else {
            return res.status(200).json({
                success: true,
                statuscode: 200,
                data: {
                    message: 'Question updated successfully',
                    result: updatedQuestion
                }
            });
        }
    } catch (error) {
        console.error('Error updating question: ', error);
        return res.status(500).json({
            success: false,
            statuscode: 500,
            data: {
                message: error.message
            }
        })
    }
});

router.delete('/question/:id', jsonParser, async (req, res, next) => {
    try {
        const questionId = req.params.id;
        const question = await questionService.deleteQuestion(questionId);
        if (!question || question.message === 'Question not found') {
            return res.status(400).json({
                success: false,
                statuscode: 400,
                data: {
                    message: 'Question not found'
                }
            });
        } else {
            return res.status(200).json({
                success: true,
                statuscode: 200,
                data: {
                    message: 'Question deleted successfully',
                    result: question
                }
            });
        }
    } catch (error) {
        console.error('Error deleting question: ', error);
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
