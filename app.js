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

app.set('json spaces', 2); // this will display the json with 2 spaces for indentations

// the following middleware are executed for every request. 
app.use(logger('dev')); // logger for dev env
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // so that json objects can be created with dot indentations.
//The above are using body-parser internally in express 4.

app.use(cookieParser());
//the above Parse Cookie header and populate req.cookies with an object keyed by the cookie names.
// Optionally you may enable signed cookie support by passing a secret string, which assigns req.secret 
//so it may be used by other middleware.
app.use(session({ secret: 'secret', resave: false, saveUninitialized: true }));
// the above is using npm package for session tracking on a single redirect url. 
//saveUninitialized: false: don't create session until something stored
//resave: false, //don't save session if unmodified
app.use(express.static(path.join(__dirname, 'public')));
//The above is use to serve static files

app.use(messages); //As no options is needed messages() is not used as messages is a function.
//The above middleware will add error and removeError methods on res object to be use in validation middleware and called from messages.ejs

//the below is for rest call.
app.use('/api', api.auth);
// the above will atuthenticate the user on every /api route.
app.use(user);// the user middleware method is call on every call to the app, that set user obj in the res.local

app.use('/api', api.router); 

app.use('/users', usersRouter); 


//below are web applications references.
//To register the user
app.get('/register', register.form);
app.post('/register', register.submit);

//Login related api.
app.get('/login', login.form);
app.post('/login', login.submit);
app.get('/logout', login.logout);

//To submit the entries.
app.get('/getEnrtyForm',  entries.form);
app.post('/postEnrtyForm', 
          validate.required('entry[title]'),
          validate.lengthAbove('entry[title]',15), 
          entries.submit);

 // to demostrate url to get data from file
app.get('/fromfile',entries.fromFile);

//To demostarte the erro message route
app.get('/errorPage',(req, res, next) => {
  throw new Error('Arun error');
});

//Below is the method for BASEURL ()
//This has to be the last route in the app.js as /:page is optional
app.get('/:page?', page(Entry.countByQuery, 5), entries.list);


if (process.env.ERROR_ROUTE) {
  app.get('/dev/error', (req, res, next) => {
    let err = new Error('database connection failed');
    err.type = 'database';
    next(err);
  });
}

app.use(indexRouter.notfound);// in this route there is no err object // so it is not found

app.use(indexRouter.error); //In this there is error object, will be called on errors. e.g) /errorPage

module.exports = app;
