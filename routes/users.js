var express    = require('express');
var users      = express.Router();
var bodyParser = require('body-parser');
var db         = require('./../db/pg');


users.route('/')
  .post(db.createUser, (req, res) => {
    res.redirect('users/success');
  })

users.route('/subscribers')
  .post(db.createSub, (req, res) => {
    res.redirect('/users/success');
})

users.route('/success')
  .get((req, res) => {
    res.render('users/success.ejs',  {user: req.session.user})
  })

users.get('/new', (req, res) => {
  res.render('users/new.ejs', {user: req.session.user});
})

users.get('/login', (req, res) => {
  res.render('users/login.ejs', {user: req.session.user});
})

users.post('/login', db.loginUser, (req, res) => {
  req.session.user = res.rows;

  // when you redirect you must force a save due to asynchronisity
  // https://github.com/expressjs/session/issues/167 **
  // "modern web browsers ignore the body of the response and so start loading
  // the destination page well before we finished sending the response to the client."

  req.session.save(function() {
    res.redirect('/');
  });
})

users.delete('/logout', (req, res) => {
  req.session.destroy((err) => {
    res.redirect('/');
  })
})



module.exports = users;
