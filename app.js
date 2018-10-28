var createError = require('http-errors');
var express = require('express');
const session = require('express-session');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const validate = require('./middleware/validate');
const messages = require('./middleware/messages');
const user = require('./middleware/user');




var indexRouter = require('./routes/index');
const api = require('./routes/api');
var usersRouter = require('./routes/users');
const entries = require('./routes/entries');
const register = require('./routes/register');
const login = require('./routes/login');
const page = require('./middleware/page');
const Entry = require('./models/entry');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
//The above 2 lines sets the view folder and view engine

app.set('json spaces', 2); // this will display the json with 2 soacesfor indentations

app.use(logger('dev')); // logger for dev env
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//The baoce are using body-parser internally in express 4.

app.use(cookieParser());
app.use(session({ secret: 'secret', resave: false, saveUninitialized: true }));
// the above is using npm package for session tracking on a single redirect url.
app.use(express.static(path.join(__dirname, 'public')));
//The aboce us use to serve static files

app.use(messages); //As no options is needed messages() is not used as messages is a function.
//The above middleware will add error and removeError methods on res object to be use in validation middleware and called from messages.ejs

app.use('/api', api.auth);
app.use(user);

app.get('/api/user/:id', api.user);
app.post('/api/entry', entries.submit);
app.get('/api/entries/:page?', page(Entry.countByQuery,5), api.entries);

app.get('/getEnrtyForm',  entries.form);
app.post('/postEnrtyForm', 
          validate.required('entry[title]'),
          validate.lengthAbove('entry[title]',15), 
          entries.submit);

app.use('/users', usersRouter);  

app.get('/register', register.form);
app.post('/register', register.submit);

app.get('/login', login.form);
app.post('/login', login.submit);
app.get('/logout', login.logout);

app.get('/:page?', page(Entry.countByQuery, 5), entries.list);

if (process.env.ERROR_ROUTE) {
  app.get('/dev/error', (req, res, next) => {
    let err = new Error('database connection failed');
    err.type = 'database';
    next(err);
  });
}

app.use(indexRouter.notfound);// in this route there is no err object // so it is not found

app.use(indexRouter.error); //In this there is error object, will be called on errors.

module.exports = app;
