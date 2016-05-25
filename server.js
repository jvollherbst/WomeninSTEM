'use strict'
var express           = require('express');
var logger            = require('morgan');
var methodOverride    = require('method-override');
var bodyParser        = require('body-parser');
var db                = require('./db/pg');
var pg                = require('pg');
var session           = require('express-session');
var pgSession         = require('connect-pg-simple')(session);
var dotenv            = require ('dotenv');
var path              = require('path');
var app               = express();

if (process.env.NODE_ENV === 'production') {
      var connectionString = process.env.DATABASE_URL;
    } else {
      var connectionString = 'postgres://jasminecardoza:' + process.env.DB_PASSWORD + '@localhost/womeninstem';
    }

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger('dev'));
dotenv.load();

var userRoutes = require(path.join(__dirname, '/routes/users'));
var postRoutes = require(path.join(__dirname, '/routes/posts'));
var searchRoutes = require(path.join(__dirname, '/routes/search'));

app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, './public/')));

app.set('views', './views')
app.set('view engine', 'ejs')


app.use(session({
  store: new pgSession({
    pg : pg,
    conString : connectionString,
    tableName : 'session'
  }),
  secret: 'secret',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 } // 30 days
}))

app.route('/')
.get(db.showPosts, (req, res) => {
  res.render('pages/home.ejs', {
    user: req.session.user,
    posts: res.rows
  });
});

app.use('/users', userRoutes)
app.use('/posts', postRoutes)
app.use('/search', searchRoutes)

var port = process.env.PORT || 3000;
var server = app.listen(port);
