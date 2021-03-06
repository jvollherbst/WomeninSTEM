var pg               = require('pg');
var bcrypt           = require('bcrypt');
var salt             = bcrypt.genSaltSync(10);
var session          = require('express-session');

if (process.env.NODE_ENV === 'production') {
      var connectionString = process.env.DATABASE_URL;
    } else {
      var connectionString = 'postgres://jasminecardoza:' + process.env.DB_PASSWORD + '@localhost/womeninstem';
    }


function loginUser(req, res, next) {
  var email = req.body.email;
  var password = req.body.password;

  pg.connect(connectionString, function(err, client, done) {
    if (err) {
      done()
      console.log(err)
      return res.status(500).json({success: false, data: err})
    }

    var query = client.query("SELECT * FROM editors WHERE email LIKE ($1);", [email], function(err, results) {
      done()
      if (err) {
        return console.error('error running query', err)
      }

      if (results.rows.length === 0) {
        res.status(204).json({success: false, data: 'no account matches that password'})
      } else if (bcrypt.compareSync(password, results.rows[0].password_digest)) {
        res.rows = results.rows[0]
        next()
      }
    })
  })
}

function createSecure(email, password, callback) {

  bcrypt.genSalt(function(err, salt) {
    bcrypt.hash(password, salt, function(err, hash) {
      callback(email, hash)
    })
  })
}

function createUser(req, res, next) {
  createSecure(req.body.email, req.body.password, saveUser);

  function saveUser(email, hash) {
    pg.connect(connectionString, function(err, client, done) {
      if (err) {
        done()
        console.log(err)
        return res.status(500).json({success: false, data: err})
      }

      var query = client.query("INSERT INTO editors ( email, password_digest) VALUES ($1, $2);", [email, hash], function(err, result) {
        done()
        if (err) {
          return console.error('error running query', err)
        }
        next()
      })
    })
  }
}

function createSub(req, res, next) {

  pg.connect(connectionString, function(err, client, done) {
    if (err) {
      done()
      console.log(err)
      return res.status(500).json({success: false, data: err})
    }

    var query = client.query("INSERT INTO subscribers (email) VALUES ($1);", [req.body.email], function(err, result) {
      done()
      if (err) {
        return console.error('error running query', err)
      }
      next()
    })
  })
}

function showPosts(req, res, next){

  pg.connect(connectionString, function(err, client, done) {
    if(err) {
      done()
      console.log(err)
      return res.status(500).json({success: false, data: err})
    }
    var query = client.query('SELECT * FROM posts', function(err, result) {
      done()
      if (err) {
        return console.error('error running query', err);
      }
      res.rows = result.rows;
      next()
    });
  });
}

function getPostsId(req, res, next){

  pg.connect(connectionString, function(err, client, done) {
    if(err) {
      done()
      console.log(err)
      return res.status(500).json({success: false, data: err})
    }
    var query = client.query('SELECT * FROM posts WHERE posts_id = $1', [req.params.posts_id], function(err, result) {
      done()
      if (err) {
        return console.error('error running query', err);
      }
      res.rows = result.rows;
      next()
    });
  });
}

function addPosts(req, res, next) {

  pg.connect(connectionString, function(err, client, done) {

    if(err) {
      done();
      console.log(err);
      return res.status(500).json({ success: false, data: err});
    }

    var query = client.query("INSERT INTO posts (name, occupation, years, country, bio, img) VALUES($1, $2, $3, $4, $5, $6)",
    [req.body.name, req.body.occupation, req.body.years, req.body.country, req.body.bio, req.body.img],
    function(err, result) {
      done()
      if(err) {
        return console.error('error, running query', err);
      }
      next()
    });
  });
}

function editPosts(req, res, next) {

  pg.connect(connectionString, function(err, client, done) {

    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }

    var query = client.query('UPDATE posts SET name = $1, occupation = $2, years = $3, country = $4, bio = $5, img = $6 WHERE posts_id = $7',
    [req.body.name, req.body.occupation, req.body.years, req.body.country, req.body.bio, req.body.img, req.params.posts_id],
    function(err, result) {
      done()
      if(err) {
        return console.error('error, running query', err);
      }
      next()
    });
  });
}

function deletePosts(req, res, next) {

  pg.connect(connectionString, function(err, client, done) {

    if(err) {
      done();
      console.log(err);
      return res.status(500).json({ success: false, data: err});
    }

    var query = client.query('DELETE FROM posts WHERE posts_id = $1', [req.params.posts_id],
    function(err, result) {
      done()
      if(err) {
        return console.error('error, running query', err);
      }
      next()
    });
  });
}

module.exports.createUser = createUser;
module.exports.loginUser = loginUser;

module.exports.createSub = createSub;

module.exports.getPostsId = getPostsId;

module.exports.showPosts = showPosts;
module.exports.addPosts = addPosts;
module.exports.editPosts = editPosts;
module.exports.deletePosts = deletePosts;
