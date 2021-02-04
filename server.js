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
app.get('/', GHandler);
// app.get('/', npsHandler);
// app.get('/', searchHandler);



    //NPS API 
    // function npsHandler(request, response) {
    //   // console.log(request.body);
    //   // const searchQuery = request.body;
    //   // console.log(request.body);
    //   const key = process.env.npiKey;
    //   let URL = `https://developer.nps.gov/api/v1/campgrounds?stateCode=wa&api_key=${key}`;
    //   // if (searchType === 'title') { URL += `+intitle:${searchQuery}`; }
    //   // if (searchType === 'author') { URL += `+inauthor:${searchQuery}`; }
    //   console.log('URL', URL);
    //   superagent.get(URL)
    //     .then(data => {
    //       console.log('!!!!!3452552345435325345230530538405835435345353545345435');
    //       console.log('!!!!!', data.body.data[0].name);
    //       const campGround = data.body.data;
    //       // const finalBookArray = data.body.data.map(campGround => new Camp(campGround));
    //       response.render('index', { data: campGround });
    //     });
    
    // }

 //Google API 
 function GHandler(request, response) {
  // console.log(request.body);
  // const searchQuery = request.body;
  // console.log(request.body);
  let location = userInput;
  const key = process.env.GAPI;
  let URL = `https://maps.googleapis.com/maps/api/place/textsearch/json?key=${key}=camping+in+${location}`;
  // let URL = `https://maps.googleapis.com/maps/api/place/textsearch/json?key=${key}=hiking+in+${location}`;

  // if (searchType === 'title') { URL += `+intitle:${searchQuery}`; }
  // if (searchType === 'author') { URL += `+inauthor:${searchQuery}`; }
  console.log('URL', URL);
  superagent.get(URL)
    .then(data => {
      console.log('!!!!!3452552345435325345230530538405835435345353545345435');
      console.log('!!!!!', data.body.data[0].name);
      const campGround = data.body.data;
      // const finalBookArray = data.body.data.map(campGround => new Camp(campGround));
      response.render('index', { data: campGround });
    });

}


    //ADDED THIS TO PUSH
//NPS Construtor

// function Camp(result) {
//   this.name = result.name ? book.name : 'no name found';
//   this.description = result.description ? book.description : 'no description found';
//   this.url = result.url ? result.url[0] : 'no author found';
//   this.image = result.industryIdentifiers;
// }


app.listen(PORT, () => {
  console.log(`App Listening on port: ${PORT}`);
});
