'use strict'
var express    = require('express');
var search     = express.Router();
var bodyParser = require('body-parser');
var session    = require('express-session');
var db         = require('./../db/search');




search.route('/')
  .get(db.showSearch, (req, res) => {
    res.render('pages/searchresults', {posts: res.rows});
  })






module.exports = search;
