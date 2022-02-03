const fs = require('fs');
const path = require('path');
const express = require('express');

// require the data that is requested by the front-end code
const { animals } = require('./data/animals');
const apiRoutes = require('./routes/apiRoutes');
const htmlRoutes = require('./routes/htmlRoutes');

// tell heroku to use port process environment
const PORT = process.env.PORT || 3001;

// instantiate the server (represent the abstraction of the server); express() assigned so we can later chain methods to Express.js server
const app = express();

// tell Express.js app to intercept POST request before it gets to callback fxn
// parse incoming string or array data
app.use(express.urlencoded({ extended: true }));
// parse incoming JSON data
app.use(express.json());
// establish Express.js middleware to instruct server to make certain files readily available
app.use(express.static('public'));

// have app use router set up in apiRoutes or HTML routes
app.use('/api', apiRoutes);
app.use('/', htmlRoutes);


// chain listen() method onto our server to make the server listen; 3001 used as it is commonly used & does not require special permissions to use; this should ALWAYS BE LAST
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});