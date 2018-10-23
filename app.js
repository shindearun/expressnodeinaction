var createError = require('http-errors');
var express = require('express');
const session = require('express-session');
var path = require('path');
var resError = require('res-error');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const validate = require('./middleware/validate');
const messages = require('./middleware/messages');

//var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const entries = require('./routes/entries');
const register = require('./routes/register');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('json spaces', 2);

app.use(resError);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({ secret: 'secret', resave: false, saveUninitialized: true }));
app.use(messages); //As no options is needed messages() is not used as messages is a function.
app.use(express.static(path.join(__dirname, 'public')));


app.use('/users', usersRouter);
app.get('/getEnrtyForm',  entries.form);
app.post('/postEnrtyForm', 
          validate.required('entry[title]'),
          validate.lengthAbove('entry[title]',15), 
          entries.submit);
app.get('/register', register.form);
app.post('/register', register.submit);
app.use('/', entries.list);

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
