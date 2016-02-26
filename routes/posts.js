'use strict'
var express    = require('express');
var posts      = express.Router();
var bodyParser = require('body-parser');
var session    = require('express-session');
var db         = require('./../db/pg');

function editorAuth(req, res, next) {
  console.log(req.session)
  if (req.session.user) {
    next()
  } else {
    res.status(401).json({succes: false, data: 'not logged in'})
  }
}

posts.route('/')
  // .get((req, res) => {
  //   res.render('posts/new.ejs',  {posts: res.rows});
  // })
  .post((req, res) => {
    // testPost.push(req.body);
    // var postID = testPost.length-1;
    //
    // res.redirect(303,'/')
    // // res.redirect(303,'./'+ postID)
  })

posts.route('/all')
  .get((req, res) => {
    res.render('posts/allposts.ejs',  {posts: res.rows});
})

posts.route('/create')
  .get((req, res) => {
    res.render('posts/new.ejs');
})

// posts.route('/:id')
//   .get((req, res) => {
//     res.send('here are the things')
//   })
//
//
// posts.route('/:id/edit')
//   .get(editorAuth, (req, res) => {
//     res.render('posts/edit.ejs', {user: req.session.user});
//   })


module.exports = posts;
