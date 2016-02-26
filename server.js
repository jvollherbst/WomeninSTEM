'use strict'
var express           = require('express');
var logger            = require('morgan');
var methodOverride    = require('method-override');
var bodyParser        = require('body-parser');
var db                = require('./db/pg');
var session           = require('express-session');
var pgSession         = require('connect-pg-simple')(session);
var pg                = require('pg');
var connectionString  = 'postgres://jasminecardoza:' + process.env.DB_PASSWORD + '@localhost/womeninstem';
var dotenv            = require ('dotenv');
var path              = require('path');
var app               = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger('dev'));
dotenv.load();

var userRoutes = require( path.join(__dirname, '/routes/users'));
var postRoutes = require( path.join(__dirname, '/routes/posts'));

// override with POST having ?_method=XXXX
/* e.g. If we need to make a PUT,
we'll POST to a url appended with ?_method=put */
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
  secret: 'secret', // something we maybe want to save with dotenv *hint hint*
  resave: false,
  cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 } // 30 days
}))

app.get('/', (req, res) => {
  res.render('pages/home.ejs', {user: req.session.user});
});


app.use('/users', userRoutes)
app.use('/posts', postRoutes)

var port = process.env.PORT || 3000; //allows user to select their own port, does not fix a port
var server = app.listen(port);
