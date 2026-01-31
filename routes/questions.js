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
router.use(cookieParser());

router.get('/', async (req, res, next) => {
    res.send('respond with a resource');
});

router.post('/', jsonParser, async (req, res, next) => {
    try {
        const {question, answer, time} = req.body;
        if (!question || !answer || !time) {
            return res.status(400).json({
                success: false,
                statuscode: 400,
                data: {
                    message: 'Question, answer and time are required'
                }
            });
        }
        
        const newQuestion = await questionService.createQuestion(question, answer, time);
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

module.exports = router;
