'use strict'
var express    = require('express');
var posts      = express.Router();
var bodyParser = require('body-parser');
var session    = require('express-session');
var db         = require('./../db/pg');
var papercut   = require('papercut');


function editorAuth(req, res, next) {
  if (req.session.user) {
    next()
  } else {
    res.render('users/new.ejs');
  }
}

posts.route('/')
  .get((req, res) => {
    res.render('/', {user: req.session.user});
  })
  .post(db.addPosts, (req, res) => {
     res.redirect('posts/all')
})

posts.route('/all')
  .get(db.showPosts, (req, res) => {
    res.render('posts/allposts.ejs', {
      user: req.session.user,
      posts: res.rows
    });
})

posts.route('/create')
  .get((req, res) => {

    if(req.session.user){

      if(req.session.user.auth){
        res.render('posts/new.ejs', {user: req.session.user});
      }
      else{
        res.render('posts/redirect.ejs', {user: req.session.user});
      }
    }

    else {
      res.render('users/new.ejs', {user: req.session.user});
    }
  })

posts.route('/:posts_id')

  .get(db.getPostsId, (req, res) => {
      if(!(req.session.user)){
        res.render('posts/post.ejs', {
          user: req.session.user,
          posts: res.rows
        });
      }
      else{
        res.render('posts/edit.ejs', {
          user: req.session.user,
          posts: res.rows
        });
      }
  })

  .put(db.editPosts, (req, res) => {
    res.status(303).redirect('/posts/' + req.params.posts_id);
  })

  .delete(db.deletePosts, (req, res) => {
      res.redirect('./all');
  })


posts.route('/:posts_id/edit')
  .get(editorAuth, db.getPostsId, (req, res) => {

    if(req.session.user){

      if(req.session.user.auth){
        console.log('true');
        res.render('posts/editpost.ejs', {
          user: req.session.user,
          posts: res.rows
        });
      }
      else{
        console.log('false');
        res.render('posts/redirect.ejs', {user: req.session.user});
      }
    }

    else {
      res.render('users/new.ejs', {user: req.session.user});
    }
  })




module.exports = posts;
