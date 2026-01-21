var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var jwt = require('jsonwebtoken');
var QuestionService = require('../services/QuestionService');
var AnswerService = require('../services/AnswerService');
var UserService = require('../services/UserService');
var userService = new UserService();
var questionService = new QuestionService();
var answerService = new AnswerService();
const { isAuth, isAdmin } = require('../middleware/authMiddleware')
const cookieParser = require('cookie-parser');
const { route } = require('./myQuizzes');
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