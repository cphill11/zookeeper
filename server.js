// require connection to express.js
const express = require('express');

// require the data that is requested by the front-end code
const { animals } = require('./data/animals');

// tell heroku to use port process environment
const PORT = process.env.PORT || 3001;

// instantiate the server (represent the abstraction of the server); express() assigned so we can later chain methods to Express.js server
const app = express();



// add before the .get() callback, create a filter functionality
function filterByQuery(query, animalsArray) {
    let personalityTraitsArray = [];
    // Save the animalsArray as filteredResults here:
    let filteredResults = animalsArray;
    if (query.personalityTraits) {
      // Save personalityTraits as a dedicated array; if personalityTraits is a string, place it into a new array and save.
      if (typeof query.personalityTraits === 'string') {
        personalityTraitsArray = [query.personalityTraits];
      } else {
        personalityTraitsArray = query.personalityTraits;
      }
      // Loop through each trait in the personalityTraits array:
      personalityTraitsArray.forEach(trait => {
        // Check the trait against each animal in the filteredResults array; it is initially a copy of the animalsArray,but here we're updating it for each trait in the .forEach() loop.
        // For each trait being targeted by the filter, the filteredResults array will then contain only the entries that contain the trait; at the end we'll have an array of animals that have every one of the traits when the .forEach() loop is finished.
        filteredResults = filteredResults.filter(
          animal => animal.personalityTraits.indexOf(trait) !== -1
        );
      });
    }
    if (query.diet) {
      filteredResults = filteredResults.filter(animal => animal.diet === query.diet);
    }
    if (query.species) {
      filteredResults = filteredResults.filter(animal => animal.species === query.species);
    }
    if (query.name) {
      filteredResults = filteredResults.filter(animal => animal.name === query.name);
    }
    // return the filtered results:
    return filteredResults;
  }




// add the .get() callback route for app.listen()
app.get('/api/animals', (req, res) => {
    let results = animals;

    // call the filterbyQuery()
    if (req.query) {
        results = filterByQuery(req.query, results);
    }
    res.json(results);
  });


// chain listen() method onto our server to make the server listen; 3001 used as it is commonly used & does not require special permissions to use
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});