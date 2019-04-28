const User = require('../models/user');
const auth = require('basic-auth');


exports.setUser = (req, res, next) => {
 // console.log(req.originalUrl);
  if (req.remoteUser) {
    res.locals.user = req.remoteUser;
  }
  const userId = req.session.uid;
  if (!userId) {
    return next(); // this will be called for rest api calls as there is no UI session
  }
  User.get(userId, (err, user) => {
    if (err) return next(err);
    req.user = res.locals.user = user;
    next();
  });
};

exports.authenticateUserForWeb = (req, res, next) => {
    const credentials = auth(req);
    if(credentials && credentials.name === 'arun' & credentials.pass === 'shinde'){
      next();
    }else{
      res.writeHead(401, {
        'WWW-Authenticate': 'Basic realm="example"'
      });
      res.end();
    }

    /* this ti authenticate from db.
      User.authenticate(name, pass, (err, user) => {
        if (user) {
            req.remoteUser = user;
        }
        next(err);
      });
    };*/
  };