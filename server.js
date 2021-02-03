'use strict';


//Load environment variables from the .env file
require('dotenv').config();

// Step 1:  Bring in our modules/dependencies
const express = require('express');
const app = express();
const cors = require('cors');
// require('ejs');
const superagent = require('superagent');
const pg = require('pg');

const methodOverride = require('method-override');


// Database Connection Setup
const client = new pg.Client(process.env.DATABASE_URL);
client.on('error', err => { throw err; });



// Step 2:  Set up our application

app.use(cors());
app.set('view engine', 'ejs');
app.use(express.static('./public'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// declare port for server
const PORT = process.env.PORT || 3000;


//routes
// app.get('/index', homeHandler);
app.get('/', homePage);
app.get('/new', npsHandler)
app.get('/searches', searchHandler);


// constuctor functions
function homePage(request, response) {

  const sql = 'SELECT * FROM booktable;';
  return client.query(sql)
    .then(results => {
      console.log(results.rows);
      response.status(200).render('pages/index');
    })
    .catch((error) => {
      console.log(error);
      response.render('pages/error');
    });
}
function deleteBook(request, response) {
  const id = request.params.book - id;
  let sql = 'DELETE FROM booktable WHERE id=$1;';
  let safeValues = [id];
  client.query(sql, safeValues);
  response.status(200).redirect('/');
}

function npsHandler(request, response) {
  let key = process.env.WEATHER_API_KEY;
  let lat = request.query.latitude;
  let lon = request.query.longitude;
  const url = `https://api.weatherbit.io/v2.0/forecast/daily?key=${key}&lat=${lat}&lon=${lon}&days=8`;
  // console.log('>>>>>', url);
  superagent.get(url)
    .then(value => {
      const weatherData = value.body.data.map(current => {
        return new Weather(current);
      });
      response.status(200).send(weatherData);
    }).catch(error => {
      console.log('ERROR', error);
      response.status(500).send('So sorry, something went wrong.');
    });
}

function searchHandler(request, response) {
  response.render('searches/new.ejs');
}

function addRouteToDatabase(request, response) {
  const { authors, title, isbn, image, description } = request.body;
  const sql = 'INSERT INTO booktable (author, title, isbn, image_url, description) VALUES ($1,$2,$3,$4,$5) RETURNING id;';
  const safeValues = [authors, title, isbn, image, description];
  client.query(sql, safeValues)
    .then((idFromSQL) => {
      console.log(idFromSQL);
      response.redirect(`books/${idFromSQL.rows[0].id}`);
    }).catch((error) => {
      console.log(error);
      response.render('pages/error');
    });
}

function searchPage(request, response) {
  console.log(request.body);
  const searchQuery = request.body.searchQuery;
  const key = NPIkey;
  console.log(request.body);
  let URL=`https://developer.nps.gov/api/v1/parks?parkCode=acad&api_key=${key}`;
      

  if (searchType === 'title') { URL += `+intitle:${searchQuery}`; }
  if (searchType === 'author') { URL += `+inauthor:${searchQuery}`; }
  console.log('URL', URL);
  superagent.get(URL)
    .then(data => {
      console.log(data.body.items[1]);
      const book = data.body.items;
      const finalBookArray = book.map(books => new Book(books.volumeInfo));
      response.render('searches/show', { renderContent: finalBookArray });
    });

    //Weather API 
    function weatherHandler(request, response) {
      let key = process.env.WEATHER_API_KEY;
      let lat = request.query.latitude;
      let lon = request.query.longitude;
      const url = `https://api.weatherbit.io/v2.0/forecast/daily?key=${key}&lat=${lat}&lon=${lon}&days=8`;
      // console.log('>>>>>', url);
      superagent.get(url)
        .then(value => {
          const weatherData = value.body.data.map(current => {
            return new Weather(current);
          });
          response.status(200).send(weatherData);
        }).catch(error => {
          console.log('ERROR', error);
          response.status(500).send('So sorry, something went wrong.');
        });
    }
}
//Book Construtor

function Map() {
  this.title = book.title ? book.title : 'no title found';
  this.description = book.description ? book.description : 'no description found';
  this.authors = book.authors ? book.authors[0] : 'no author found';
  this.isbn = book.industryIdentifiers;
  //splice method
  //
  console.log('url', URL);
}

function AirQ() {
  this.title = book.title ? book.title : 'no title found';
}

function Weather(result) {
  this.time = new Date(result.ts * 1000).toDateString();
  this.forecast = result.weather.description;
}


function errHandler(request, response) {
  response.status(404).render('pages/error');
}


client.connect()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`App Listening on port: ${PORT}`);
    });
  })
  .catch(error => {
    console.log(error);
  });


// app.listen(PORT, () => {
//   console.log(`now listening on port ${PORT}`);
// });

// Connect to DB and Start the Web Server
client.connect()
  .then(() => {
    app.listen(PORT, () => {
      console.log('Server up on', PORT);
      console.log(`Connected to database ${client.connectionParameters.database}`);
    });
  })
  .catch(err => {
    console.log('ERROR', err);
  });

