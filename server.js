'use strict'
var express         = require('express');
var logger          = require('morgan');
var methodOverride  = require('method-override');
var bodyParser      = require('body-parser');
y// var db              = require('./db/pg');
var dotenv          = require ('dotenv');
var app             = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger('dev'));
dotenv.load();


// override with POST having ?_method=XXXX
/* e.g. If we need to make a PUT,
we'll POST to a url appended with ?_method=put */
app.use(methodOverride('_method'))

app.use(express.static(path.join(__dirname, './public/')))
app.set('views', './views')
app.set('view engine', 'ejs')


app.get('/', (req, res) => {
  res.send('homepage test');
});


// app.use('/', require(path.join(__dirname, '/routes/')));

var port = process.env.PORT || 3000; //allows user to select their own port, does not fix a port
var server = app.listen(port);
