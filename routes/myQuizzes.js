var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
router.use(cookieParser());

/* GET home page. */
router.get('/', async(req, res, next) => {
    res.render('myQuizzes', {title: 'myQuizzes'});
});

module.exports = router;
