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
    res.render('posts/allposts.ejs', {posts: res.rows});
})

posts.route('/create')//should render the form for creating new posts
  .get((req, res) => {
    res.render('posts/new.ejs', {
      editForm:{
        title: 'Create a Post',
        postURL: '/posts',
      }
    });
  })

//posts by id
posts.route('/:posts_id')
  .get(db.getPostsId, (req, res) => {
    res.render('posts/post.ejs', {posts: res.rows});
  })

  .put(db.editPosts, (req, res) => {
    res.status(303).redirect('/posts/' + req.params.posts_id);
  })

  .delete(db.deletePosts, (req, res) => {
    res.redirect("./all");
  })

posts.route('/:posts_id/edit')
  .get((req, res) => {
    res.render('posts/new.ejs', {
      editForm:{
        title: 'Edit a Post',
        postURL: '/posts/' + req.params.posts_id + '?_method=PUT',
      }
    });
  })

// posts.route('/:posts_id/edit')
//   .get(db.getPostsId, (req, res) => {
//     res.render('posts/edit', {posts: res.rows});
//   })

//edit post by authorization
// posts.route('/:id/edit')
//   .get(editorAuth, (req, res) => {
//     res.render('posts/edit.ejs', {user: req.session.user});
//   })


module.exports = posts;
