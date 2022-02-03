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


// function that takes in both id & array of animals, returning a single object
function findById(id, animalsArray) {
    const result = animalsArray.filter(animal => animal.id === id) [0];
    return result;
}

// POSTing a new animal causes it to be be imported to animals array from animals.json file
function createNewAnimal(body, animalsArray) {
    const animal = body;
    animalsArray.push(animal);
    fs.writeFileSync(
        path.join(__dirname, './data/animals.json'),
        JSON.stringify({ animals: animalsArray }, null, 2)
    );
    // return finished code to post route for response
    return animal;
}

// validation functionality
function validateAnimal(animal) {
    if (!animal.name || typeof animal.name !== 'string') {
        return false;
    }

    if (!animal.species || typeof animal.species !== 'string') {
        return false;
    }

    if (!animal.diet || typeof animal.diet !== 'string') {
        return false;
    }

    if (!animal.personalityTraits || typeof animal.personalityTraits !== 'string') {
        return false;
    }

    return true;
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


// add a 2nd .get() to filter more closely
app.get('/api/animals/:id', (req, res) => {
    const result = findById(req.params.id, animals);
    if (result) {
        res.json(result);
    } else {
        res.sendStatus(404);
    }
});

// set up a rount on server that accepts data to be used or stored server-side; .post means that we defined the route to listen for POST requests (not GET requests)
app.post('/api/animals', (req, res) => {
    // req.body is where our incoming content will be; set id based on what the next index of the array will be
    req.body.id = animals.length.toString();

    // if any data in req.body is in incorrect, send 400 error back
    if (!validateAnimal(req.body)) {
        res.status(400).send('The animal is not properly formatted.');
    } else {
        
    // add animal to json file and animals array in this fxn
    const animal = createNewAnimal(req.body, animals);

    res.json(req.body);
  }
});

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