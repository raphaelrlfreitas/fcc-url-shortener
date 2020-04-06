'use strict';

var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

mongoose.connect('mongodb+srv://raphaelfreitas:secretpassword@fccmongodbapi-spf81.mongodb.net/test?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true});
var Schema = mongoose.Schema;

// MongoDB Model creation
var shorturlSchema = new Schema({
  originalUrl: { type: String, required: true}
});

var ShortUrl = mongoose.model('Short URL', shorturlSchema);

var cors = require('cors');

var app = express();

// Basic Configuration 
var port = process.env.PORT || 3000;

/** this project needs a db !! **/ 
// mongoose.connect(process.env.DB_URI);

app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));

/** this project needs to parse POST bodies **/
// you should mount the body-parser here

app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});

  
// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});


app.post("/api/shorturl/new", (req, res) => {
  const urlRegex = /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/

  if(!urlRegex.test(req.body.url)){
    res.json({ error: "invalid URL"})
  }

  const shortUrl = new ShortUrl({ originalUrl: req.body.url });

  shortUrl
    .save()
    .then(result => {
      console.log(result);
      res.json({
        original_url: result.originalUrl,
        short_url: result._id
      });
    })
    .catch(err => console.log(err));

});

app.listen(port, function () {
  console.log('Node.js listening ...');
});

app.get("/api/shorturl/:id", (req, res) => {
  ShortUrl.findById(req.params.id, (err, data) =>{
    if(err) return console.log(err);
    res.redirect(data.originalUrl);
  });

})