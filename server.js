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
app.get('/', homeHandler);
app.get('/pick', searchpageHandler);
app.get('/favs', favHandler);
app.get('/about', aboutHandler);
app.post('/search', GHandler);//posting new information to server/search route
//DB Routes
app.post('/saves', saveHikeAndCamp);
app.get('/teambio', (req, res)=> { // can be named whatever/what user sees
  res.render('pages/team/teambio');// absolute - actually gets the file the user sees
})






//Home Handler
function homeHandler(request, response) {
  response.render('index');
}


function searchpageHandler(req,res){
  res.render('pages/pick/tbd');
}


function aboutHandler(req, res){
  res.render('pages/team/teambio');
}


function favHandler(req, res) {
  const SQL = 'SELECT * FROM hiking;';
  return client.query(SQL)
    .then(results => {
      // console.log(results.rows);
      let yourFavs = results.rows;
      res.status(200).render('pages/favorites/favorites', { data: yourFavs });
    })
    .catch(err => {
      console.log(err);
    });
}


function saveHikeAndCamp(req, res) {
  const {name, types, status, address, rating} = req.body;
  const SQL = `INSERT INTO hiking (name,types,business_status,formatted_address,rating) VALUES ($1,$2,$3,$4,$5);`;
  const values = [name, types, status, address, rating];
  // console.log(SQL,values);
  client.query(SQL,values)
    .then( results => {
      console.log('we did it boy');
      res.redirect('/');
    }).catch((error) => {
      console.log(error);
      res.render('pages/error');
    });
}


// IQAIR API 
function iHandler(request, response, campArray, weatherData) {
  let location = request.body.city;
  const key = process.env.IQKey;
  let URL = `http://api.airvisual.com/v2/city?city=${location}&state=Washington&country=USA&key=${key}`;
  // console.log(URL)
  superagent.get(URL)
    .then(data => {
      const airQ = data.body.data.current.pollution;
      const yourAir = new Quality(airQ);

      console.log('camp array >>>>>>>>>>>>>>>>>>>>>>>>', campArray);

      let toast = '';

      campArray.forEach(data =>{
        toast += `${data.latLon.lat},${data.latLon.lng}:`;
      })

      toast = toast.substring(0 ,toast.length-1 );
      console.log('toast >>>>>>>>>>>>>>>>>>>>>', toast);

      response.render('pages/results/results-info', { request, response, campArray, weatherData, yourAir, campArrayString: toast });

    });
}



//Weather API
function weatherHandler(request, response, campArray) {
  let key = process.env.WEATHER_API_KEY;
  let location = request.body.city;
  const url = `https://api.weatherbit.io/v2.0/forecast/daily?key=${key}&city=${location}&country=US&days=8`;
  superagent.get(url)
    .then(value => {
      const weatherData = value.body.data.map(current => new Weather(current));
      // console.log('camp array >>>>>>>>>>>>>>>>>>>>>>>>', campArray);
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
  const key = process.env.API_KEY;
  let URL = `https://maps.googleapis.com/maps/api/place/textsearch/json?key=${key}&query=${travelType}+in+${location}`;
  superagent.get(URL)
    .then(data => {
      // console.log(data.body);
      const campArray = data.body.results.map(campGround => new Google(campGround));
      weatherHandler(request, response, campArray);
      console.log('camp array >>>>>>>>>>>>>>>>>>>>>>>>', campArray);
    });
}


//Google Constructor
function Google(results) {
  // console.log(results);
  this.name = results.name;
  this.types = results.types;
  this.business_status = results.business_status;
  this.formatted_address = results.formatted_address;
  this.rating = results.rating;
  this.latLon = results.geometry.location;
  let key = process.env.GPHOTO;
  let url = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&key=${key}&photoreference=`;
  this.photoRef = results.photos ? url + results.photos[0].photo_reference : url + "ATtYBwKqw1Vj1GPGBlRIOgRI9KCWsquDnKd0uezUlIHYFOGX05eNcw_RX_xNZaKKxFOXh69bjnT2eb2T27w93CG41f2KP3ywS8_20u1wFzMACs0aSKFJGkQgxJEEIDXBUPs3Dbj2R7KkIprmaPfl2u_Yu0kGa_TYX9IpA2ZWpNgXT6xK6GbH";
  

}


//Weather Constructor
function Weather(result) {
  this.time = new Date(result.ts * 1000).toDateString();
  this.forecast = result.weather.description;
}
//Iq Construtor
function Quality(result) {
  this.ts = result.ts;
  this.aqius = result.aqius;
  this.mainus = result.mainus;
  this.aqicn = result.aqicn;
  this.maincn = result.maincn;
}


client.connect()
  .then( () =>{
    app.listen(PORT, () => {
      console.log(`App Listening on port: ${PORT}`);
      console.log(client.connectionParameters.database);
    });

  })