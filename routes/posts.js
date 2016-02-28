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
    // res.status(401).json({succes: false, data: 'not logged in'})
    res.render('users/new.ejs');
  }
}

posts.route('/')
  .get((req, res) => {
    res.render('/', {user: req.session.user});
  })
  // .post((req, res) => {
  //   testPost.push(req.body);
  //   var postID = testPost.length-1;
  //
  //   res.redirect(303,'/')
  //   // res.redirect(303,'./'+ postID)
  // })
  .post(db.addPosts, (req, res) => {//should run the function to post data to my database
     res.redirect('posts/all') //displays ALL posts in db
      // var postID = res.rows[0].test_id;
    // res.redirect('posts/' + req.body.test_id)
})

posts.route('/all')//should render all posts in my db
  .get(db.showPosts, (req, res) => {
    res.render('posts/allposts.ejs', {
      user: req.session.user,
      posts: res.rows
    });
})

posts.route('/create')//should render the form for creating new posts
  .get(editorAuth, (req, res) => {
    res.render('posts/new.ejs', {user: req.session.user});
  })

//posts by id
posts.route('/:posts_id')

  .get(db.getPostsId, (req, res) => {
      if (req.session.user){
        res.render('posts/edit.ejs', {
          user: req.session.user,
          posts: res.rows
        });
      }
      else{
        res.render('posts/post.ejs', {posts: res.rows});
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
