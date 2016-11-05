var express = require('express');
var bodyParser = require('body-parser');
var mysql      = require('mysql');
var path = require('path');

var app = express();
//Serve static content for the app from the "public" directory in the application directory.

var DIRECTORY = __dirname + '/app/public/';
console.log(DIRECTORY);

app.use(express.static(DIRECTORY));

app.set('views', __dirname + '/app/public/');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: false
}));

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'austin823',
  database : 'snuggleseeker'
});

connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  };

  console.log('connected as id ' + connection.threadId);

});

app.get('/', function(req,res) {
  console.log('GET -> HOME');
    connection.query('SELECT * FROM user;', function(err, data) {
      if (err) throw err;
      console.log(data);
      res.render('home.html', {user: data});

    });
});

app.get('/friends', function(req,res) {
  res.render('friends.html');
});


app.get('/api/friends', function(req,res) {
    connection.query('SELECT * FROM user', function(err, result) {
      if (err) throw err;
      res.send({data: result});
    });
});

app.post('/api/friends', function(req,res) {
  console.log('POST -> CREATE');
  console.log(req.body);
    connection.query('INSERT INTO user SET ?', req.body, function(err, result) {
      if (err) throw err;
      res.redirect('/');
    });
});

app.delete('/delete', function(req,res){
  console.log('DELETE');
    connection.query('DELETE FROM user WHERE id = ?', [req.body.id], function(err, result) {
      if (err) throw err;
      res.redirect('/');
    });
});

app.put('/update', function(req,res) {

    connection.query('UPDATE plans SET user = ? WHERE id = ?', [req.body.user, req.body.id], function(err, result) {
      if (err) throw err;
      res.redirect('/');
    });
});

app.get('/survey', function(req,res) {
  res.render('survey.html', {});
});



var port = 3000;
app.listen(port);

console.log('listening on port '+ port);