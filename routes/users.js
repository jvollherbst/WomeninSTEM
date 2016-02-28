var express    = require('express');
var users      = express.Router();
var bodyParser = require('body-parser');
var db         = require('./../db/pg');


users.route('/')
  .post(db.createUser, (req, res) => {
    res.redirect('users/success');
  })

users.route('/success')
    .get((req, res) => {
      res.render('users/success.ejs')
    })

// users.get('/success', (req, res) => {res.render('/users/success.ejs')})

// users.route('/')
users.get('/new', function(req, res) {
  res.render('users/new.ejs')
})

users.get('/login', function(req, res) {
  res.render('users/login.ejs');
})

users.post('/login', db.loginUser, function(req, res) {
  req.session.user = res.rows

  // when you redirect you must force a save due to asynchronisity
  // https://github.com/expressjs/session/issues/167 **
  // "modern web browsers ignore the body of the response and so start loading
  // the destination page well before we finished sending the response to the client."

  req.session.save(function() {
    res.redirect('/')
  });
})

users.delete('/logout', function(req, res) {
  req.session.destroy(function(err){
    res.redirect('/');
  })
})



module.exports = users;
