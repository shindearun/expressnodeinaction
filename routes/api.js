const auth = require('basic-auth');
const User = require('../models/user');
const Entry = require('../models/entry');


exports.user = (req, res, next) => {
  User.get(req.params.id, (err, user) => {
    if (err) return next(err);
    if (!user.userId) {
        return res.status(404).send('Sorry, we cannot find User!');
    }
    res.json(user);
  });
};

exports.auth1 = (req, res, next) => {
  req.remoteUser = auth(req);
  next();
};
exports.auth = (req, res, next) => {
    const { name, pass } = auth(req);
    User.authenticate(name, pass, (err, user) => {
      if (user) {
          req.remoteUser = user;
      }
      next(err);
    });
  };

exports.entries = (req, res, next) => {
  let userName = "";
  if(res.locals.user){
    userName = res.locals.user.name;
  }
  const page = req.page;
  Entry.getRange(page.from, page.to,userName).then((entries) => {
    res.format({
      'application/json': () => {
        res.send(entries);
      },
      'application/xml': () => {
        res.render('entries/xml', { entries: entries });
      }
    });
  }).catch((err) => {
    return next(err);
  });   
}