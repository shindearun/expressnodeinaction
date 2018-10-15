var express = require('express');
var router = express.Router();
const db = require('../db');

/* GET home page. */
router.get('/', function(req, res, next) {
  let dbcon = db.getDb();
  db.Article.create({ title: 'Express Arun' }).then(() => {
    db.Article.all().then(articles => {
      console.log(articles);
      var article = articles[0];
      res.render('index', article);
    });
  });


});

module.exports = router;
