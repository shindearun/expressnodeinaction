const Entry = require('../models/entry');
const User = require('../models/user');

exports.list = (req, res, next) => {
  let userName = "";
  if(res.locals.user){
    userName = res.locals.user.name;
  }
  const page = req.page;
  Entry.getRange(page.from, page.to,userName).then((entries) => {
    res.render('entriesList', {
      title: 'Entries',
      entries: entries
    });
  }).catch((err) => {
    return next(err);
  });
};

exports.submit = (req, res, next) => {
  const data = req.body.entry;
  let user = null;
  let userName1 = "";
  if (res.locals.user) {
    userName1 = res.locals.user.name;
  } else {
    userName1 = "dummy";
  }
  const entry = new Entry({
    username: userName1,
    title: data.title,
    body: data.body
  });

  entry.save((err) => {
    if (err) return next(err);
    if (req.remoteUser) {
      res.json({ message: 'Entry added.' });
    } else {
      res.redirect('/');
    }
  });
};

exports.form = (req, res) => {
  console.log("in getting post form");
  /*const userdemo = new User({ name: 'Example', pass: 'test' });
  userdemo.save((err) => {
    if (err) {
      console.log(err);
    } else {
      console.log('user Id %d', userdemo.userId);
    }
  });*/
  res.render('entryForm', { title: 'Post' });
};