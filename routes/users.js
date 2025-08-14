var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
router.use(cookieParser());

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
