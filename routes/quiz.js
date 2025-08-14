var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
router.use(cookieParser());

router.get('/', function(req, res, next) {
    try {
        res.render('quiz', {title: 'Quizmaker'});
    } catch (error) {
        console.log(error);
    }
});

module.exports = router;
