const fs = require('fs');
const path = require('path');
const express = require('express');

// require the data that is requested by the front-end code
const { animals } = require('./data/animals');

// tell heroku to use port process environment
const PORT = process.env.PORT || 3001;

// instantiate the server (represent the abstraction of the server); express() assigned so we can later chain methods to Express.js server
const app = express();

// establish Express.js middleware to instruct server to make certain files readily available
app.use(express.static('public'));

// tell Express.js app to intercept POST request before it gets to callback fxn
// parse incoming string or array data
app.use(express.urlencoded({ extended: true }));
// parse incoming JSON data
app.use(express.json());


// route to index.html; ('/') connects to root route of server
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

app.get('/animals', (req, res) => {
    res.sendFile(path.join(__dirname, './public/animals.html'));
});

app.get('/zookeepers', (req, res) => {
    res.sendFile(path.join(__dirname, './public/zookeepers.html'));
});

// wildcard ('*') always goes last in line of app.get functionality, otherwise it will take precedence over all the others
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'));
});
// chain listen() method onto our server to make the server listen; 3001 used as it is commonly used & does not require special permissions to use; this should ALWAYS BE LAST
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});