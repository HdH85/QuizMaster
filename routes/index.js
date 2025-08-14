var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
router.use(cookieParser());

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Quizmaster' });
});

module.exports = router;
