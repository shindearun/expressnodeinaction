const User = require('../models/user');

module.exports = (req, res, next) => {
  console.log(req.originalUrl);
  if (req.remoteUser) {
    res.locals.user = req.remoteUser;
  }
  const userId = req.session.uid;
  if (!userId) return next();
  User.get(userId, (err, user) => {
    if (err) return next(err);
    req.user = res.locals.user = user;
    next();
  });
};
