require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
const { createProxyMiddleware } = require('http-proxy-middleware');
const bodyParser = require('body-parser');

var indexRouter = require('./routes/index');
var authRouter = require('./routes/auth');
var quizRouter = require('./routes/quiz');
var myQuizzesRouter = require('./routes/myQuizzes');
var playQuizRouter = require('./routes/playQuiz');

var db = require('./models');
db.sequelize.sync({ force: false }).then(async () => {
  console.log('Database & tables all good!');
}).catch(err => {
  console.log('Unable to synchronize the database:', err);
});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use('/api', createProxyMiddleware({
    target: 'http://localhost:3000',
    changeOrigin: true,
    pathRewrite: {
        '^/api': ''
    }
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

app.use(session({
  secret: process.env.SESSION_SECRET || 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set to true if using HTTPS
}));

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/quiz', quizRouter);
app.use('/myquizzes', myQuizzesRouter);
app.use('/playQuiz', playQuizRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
