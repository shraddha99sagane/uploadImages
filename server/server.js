const express = require('express');
const bodyParser = require('body-parser');
var multer = require('multer');
const dbConfig = require('./config/database.config.js');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

// Connecting to the database
mongoose.connect(dbConfig.url, {
    useNewUrlParser: true
}).then(() => {
    console.log("Successfully connected to the database");

}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});



// create express app
const app = express();

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse requests of content-type - application/json
app.use(bodyParser.json())
app.use(express.static(__dirname + '/uploads'));
app.use(errorHandler)

app.use(function (req, res, next) {
  console.log("req.body", req.body);
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

 // define Schema
  var ImagesSchema = mongoose.Schema({
      path: String,
      filename: String 
  });
    // compile schema to model
  var Images = mongoose.model('Images', ImagesSchema);

var storage = multer.diskStorage({
  // destination
  destination: function (req, file, cb) {
    cb(null, './uploads')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  }
});

var upload = multer({ storage: storage });

app.get("/", function(req, res) {
  res.json('working');
});

app.get("/api/getImages", function(req, res) {
    Images.find({}, function (err, images) {
      if (err){ 
        next(err)
      } else {
          res.send(images);
      }
    });
});
app.post("/api/upload", upload.array("uploads[]", 12), function (req, res) {
  Images.create(req.files, function (err, docs) {
      if (err){ 
        next(err)
      } else {
          res.send(req.files);
      }
    });

});

function errorHandler (err, req, res, next) {
  res.send('error', { error: err })
}

// listen for requests
app.listen(3000, () => {
console.log("Server is listening on port 3000");
});