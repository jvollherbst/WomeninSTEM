var pg = require('pg');

if (process.env.NODE_ENV === 'production') {
    var connectionString = process.env.DATABASE_URL;
  }
  else {
    var connectionString = 'postgres://jasminecardoza:' + process.env.DB_PASSWORD + '@localhost/womeninstem';
  }

function showSearch(req, res, next){
  pg.connect(connectionString, function(err, client, done) {
    if(err) {
      done()
      console.log(err)
      return res.status(500).json({success: false, data: err})
    }
    var query = client.query('SELECT * FROM posts WHERE name LIKE $1', [req.body.name], function(err, result) {
      done()
      if (err) {
        return console.error('error running query', err);
      }
      res.rows = result.rows;
      next()
    });
  });
}


module.exports.showSearch = showSearch;
