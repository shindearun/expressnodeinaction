const express = require('express');

function message(req) {
  return (msg, type) => {
    type = type || 'info';
    let sess = req.session;
    sess.messages = sess.messages || [];
    sess.messages.push({ type: type, string: msg });
  };
};

module.exports = (req, res, next) => {
  res.message = message(req);
  res.error = (msg) => {
    res.message(msg, 'error');
  };
  res.info = (msg) => {
    res.message(msg, 'info');
  };
  res.locals.messages = req.session.messages || [];
  res.locals.removeMessages = () => {
    req.session.messages = [];
  };
  next();
};
