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
    .get((req, res) => {
      console.log(req.session.user);

      if(req.session.user){//adding user to session obj — contains all my user's info which I added in the user route

        if(req.session.user.auth){//looking for the auth value in my current user
          console.log('true');
          console.log(posts);
          res.render('posts/new.ejs', {user: req.session.user});
        }
        else{
          console.log('false');
          console.log(posts);
          res.render('posts/redirect.ejs', {user: req.session.user});
        }
      }

      else {
        res.render('users/new.ejs', {user: req.session.user});
      }

      // var posts = res.rows;

      // posts.forEach(function(el){
      //   if(el.auth){
      //     console.log('if true');
      //     console.log(res.rows);
      //     res.render('posts/new.ejs', {user: req.session.user});
      //   }
      //   else{
      //     console.log('if false');
      //     console.log(res.rows);
      //     res.render('posts/redirect.ejs', {user: req.session.user});
      //   }
      // })
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

  .delete(db.deletePosts, (req, res) => {
      res.redirect('./all');
  })


posts.route('/:posts_id/edit')
  .get(editorAuth, db.getUserAuth, db.getPostsId, (req, res) => {

    if(req.session.user){//adding user to session obj — contains all my user's info which I added in the user route

      if(req.session.user.auth){//looking for the auth value in my current user
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
