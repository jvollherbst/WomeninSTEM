'use strict'
var express    = require('express');
var posts      = express.Router();
var bodyParser = require('body-parser');
var session    = require('express-session');
var db         = require('./../db/pg');

posts.use(function(req, res, next) {
  console.log(req.session)
  if (req.session.user) {
    next()
  } else {
    res.status(401).json({succes: false, data: 'not logged in'})
  }
})

posts.route('/')
  .get( (req, res) => {
    res.render('posts/edit.ejs', {user: req.session.user});
  })


module.exports = posts;
