'use strict'
var express    = require('express');
var posts      = express.Router();
var bodyParser = require('body-parser');
var session    = require('express-session');
var db         = require('./../db/pg');


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
  .post(db.addPosts, (req, res) => {//should run the function to post data to my database
     res.redirect('posts/all') //displays ALL posts in db
})

posts.route('/all')//should render all posts in my db
  .get(db.showPosts, (req, res) => {
    res.render('posts/allposts.ejs', {
      user: req.session.user,
      posts: res.rows
    });
})

// posts.route('/create')//should render the form for creating new posts
//   .get(editorAuth, (req, res) => {
//     res.render('posts/new.ejs', {user: req.session.user});
//   })

posts.route('/create')//should render the form for creating new posts
  .get(db.showPosts, db.getUserAuth, (req, res) => {
    if(!(req.session.user)){
      res.render('users/new.ejs', {user: req.session.user});
    }
    else{
      var posts = res.rows;
      posts.forEach(function(el){
        if(!(el.auth)){
          next()
        }
        else{
          console.log('else true');
          console.log(res.rows);
          res.render('posts/new.ejs', {user: req.session.user});
        }
      })
    }
    console.log('if false');
    res.render('posts/redirect.ejs', {user: req.session.user});
  })

//posts by id
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

  // .delete(editorUserAuth, db.deletePosts, db.getUserAuth, (req, res) => {
  //
  //   if(!(req.body.auth)){
  //   res.redirect("/posts/redirect");
  //   }
  //   else{
  //   res.redirect("./all");
  //   }
  // })

  .delete(db.deletePosts, db.getUserAuth, (req, res) => {
      res.redirect('./all');
  })

// posts.route('/:posts_id/edit')
//   .get(editorAuth, db.getUserAuth, db.getPostsId, (req, res) => {
//     console.log(req.body.auth);
//     if(req.body.auth){
//       res.render('posts/editpost.ejs', {posts: res.rows});
//     }
//     else{
//       res.render('posts/redirect.ejs');
//     }
//   })

posts.route('/:posts_id/edit')
  .get(editorAuth, db.getUserAuth, db.getPostsId, (req, res) => {
    res.render('posts/editpost.ejs', {
      user: req.session.user,
      posts: res.rows
    });
  })


module.exports = posts;
