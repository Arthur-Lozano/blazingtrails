'use strict';
//Load environment variables from the .env file
require('dotenv').config();
// Step 1:  Bring in our modules/dependencies
const express = require('express');
const app = express();
const cors = require('cors');
const superagent = require('superagent');
const pg = require('pg');
const methodOverride = require('method-override');
// Database Connection Setup
// const client = new pg.Client(process.env.DATABASE_URL);
// client.on('error', err => { throw err; });
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
app.get('/', homeHandler);
app.post('/search', GHandler);//posting new information to server/search route

// app.get('/', npsHandler);
// app.get('/weather', weatherHandler);
    // IQAIR API 
    function iHandler(request, response, campArray, weatherData) {
      // console.log(request.body);
      // const searchQuery = request.body;
      // console.log(request.body);
      let city = 'seattle';
      const key = process.env.IQKey;
      let URL = `http://api.airvisual.com/v2/city?city=${city}&state=Washington&country=USA&key=${key}`;
      // if (searchType === 'title') { URL += `+intitle:${searchQuery}`; }
      // if (searchType === 'author') { URL += `+inauthor:${searchQuery}`; }
      superagent.get(URL)
        .then(data => {
          const campGround = data.body.data;
          // const finalBookArray = data.body.data.map(campGround => new Camp(campGround));
          response.render('index', { weatherData, data:campArray, data:weatherArr });
        });
    }

    // request.body.city
    // request.body.search

//Home Handler

function homeHandler (request, response) {
  response.render('pages/pick/tbd')
}

 //Weather API
 function weatherHandler(request, response, campArray) {
  let key = process.env.WEATHER_API_KEY;
  let city = 'seattle';
  const url = `https://api.weatherbit.io/v2.0/forecast/daily?key=${key}&city=${city}&country=US&days=8`;
  console.log({url});
  superagent.get(url)
    .then(value => {
      const weatherData = value.body.data.map(current => new Weather(current));
      iHandler(request, response, campArray, weatherData);//render once for EACH route
    }).catch(error => {
      console.log('ERROR', error);
      response.status(500).send('So sorry, something went wrong.');
    });
}


 //Google API 
 function GHandler(request, response) {
  let location = request.body.city;
  let travelType = request.body.search;
  // if (travelType === 'hiking' ? travelType = 'hiking':travelType='camping'); 
  const key = process.env.API_KEY;
  let URL = `https://maps.googleapis.com/maps/api/place/textsearch/json?key=${key}&query=${travelType}+in+${location}`;
  // let URL = `https://maps.googleapis.com/maps/api/place/textsearch/json?key=${key}=hiking+in+${location}`;
  superagent.get(URL)
    .then(data => {
      const campArray = data.body.results.map(campGround => new Google(campGround));
      weatherHandler(request, response, campArray);
    });
}


//Google Constructor
function Google(results) {
  this.name = results.name;
  this.types = results.types;
  this.business_status = results.business_status;
  this.formatted_address = results.formatted_address;
  this.rating = results.rating;
}


//Weather Constructor
function Weather(result) {
  this.time = new Date(result.ts * 1000).toDateString();
  this.forecast = result.weather.description;
}
    //ADDED THIS TO PUSH

    // "pollution": {
    //   "ts": "2021-02-06T06:00:00.000Z",
    //   "aqius": 67,
    //   "mainus": "p2",
    //   "aqicn": 28,
    //   "maincn": "p2"
//Iq Construtor
function Iq(result) {
  this.ts = result.data.ts;
  this.aqius = result.data.aqius;
  this.mainus = result.data.mainus;
  this.aqicn = result.data.aqicn;
  this.maincn = result.data.maincn;
}
app.listen(PORT, () => {
  console.log(`App Listening on port: ${PORT}`);
});