// require connection to express.js
const express = require('express');

// require the data that is requested by the front-end code
const { animals } = require('./data/animals');

// instantiate the server (represent the abstraction of the server); express() assigned so we can later chain methods to Express.js server
const app = express();





// add before the .get() callback, create a filter functionality
function filterByQuery(query, animalsArray) {
    let filteredResults = animalsArray;
    if (query.diet) {
        filteredResults = filteredResults.filter(animal => animal.diet === query.diet);
    }
    if (query.species) {
        filteredResults = filteredResults.filter(animal => animal.species === query.species);
    }
    if (query.name) {
        filteredResults = filteredResults(animal => animal.name === query.name);
    }
    return filteredResults;
}




// add the .get() callback route for app.listen()
app.get('/api/animals', (req, res) => {
    let results = animals;

    // call the filterbyQuery()
    if (req.query) {
        results = filteredByQuery(req.query, results);
    }
    res.json(results);
  });


// chain listen() method onto our server to make the server listen; 3001 used as it is commonly used & does not require special permissions to use
app.listen(3001, () => {
    console.log(`API server now on port 3001!`);
});