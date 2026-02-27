var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var jwt = require('jsonwebtoken');
var QuizService = require('../services/QuizService');
var quizService = new QuizService();
// var UserService = require('../services/UserService');
// var userService = new UserService();
// const { isAuth, isAdmin } = require('../middleware/authMiddleware')
const cookieParser = require('cookie-parser');
router.use(cookieParser());

// router.get('/', async (req, res, next) => {
//     try {
//         res.render('playQuiz', {title: 'Play Quiz', quiz: null });
//     } catch (error) {
//         console.log(error);
//     }
// });

router.get('/:quizId', async (req, res, next) => {
    try {
        const quizId = req.params.quizId;
        const quiz = await quizService.getQuizById(quizId);

        if (!quiz) {
            return res.status(404).send('Quiz not found');
        }
        res.render('playQuiz', {title: 'Play Quiz', quiz: quiz});
    } catch (error) {
        console.log(error);
    }
});

module.exports = router;