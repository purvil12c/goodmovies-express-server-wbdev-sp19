const express = require('express');
const bodyParser = require('body-parser');
var session = require('express-session');
var cors = require('cors');

// create express app
const app = express();

var whitelist = ['http://localhost:3000', 'http://react-app-url-goodmovies.com']
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}

app.use(cors(corsOptions));

app.use(session({secret: 'ssshhhhh'}));

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse requests of content-type - application/json
app.use(bodyParser.json())

// Configuring the database
const dbConfig = require('./config/config.js');
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

// define a simple route
app.get('/', (req, res) => {
    res.json({"message": "GoodMovies Backend Server"});
});

require('./app/routes/user.routes.js')(app);

// listen for requests
app.listen(process.env.PORT || 3000, () => {
    console.log("Server is listening on port 3000");
});
