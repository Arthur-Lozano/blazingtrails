'use strict';


//Load environment variables from the .env file
require('dotenv').config();

// Step 1:  Bring in our modules/dependencies
const express = require('express');
const app = express();
const cors = require('cors');
<<<<<<< HEAD
=======
// require('ejs');
>>>>>>> efa1b0082ef5c4660494d347475910ed95e081a5
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
// app.get('/', homePage);
app.get('/', npsHandler)
// app.get('/', searchHandler);



    //NPS API 
    function npsHandler(request, response) {
      // console.log(request.body);
      // const searchQuery = request.body;
      // console.log(request.body);
      let URL = `https://developer.nps.gov/api/v1/campgrounds?stateCode=wa&api_key=`;
      // if (searchType === 'title') { URL += `+intitle:${searchQuery}`; }
      // if (searchType === 'author') { URL += `+inauthor:${searchQuery}`; }
      console.log('URL', URL);
      superagent.get(URL)
        .then(data => {
          console.log('!!!!!3452552345435325345230530538405835435345353545345435');
          console.log('!!!!!', data.body.data[0].name);
          const campGround = data.body.data;
          // const finalBookArray = book.map(campGround => new campGround(campGround));
          response.render('index', { data: campGround });
        });
    
    }


    //ADDED THIS TO PUSH
//Book Construtor

// function Map() {
//   this.title = book.title ? book.title : 'no title found';
//   this.description = book.description ? book.description : 'no description found';
//   this.authors = book.authors ? book.authors[0] : 'no author found';
//   this.isbn = book.industryIdentifiers;
//   //splice method
//   //
//   console.log('url', URL);
// }

// function AirQ() {
//   this.title = book.title ? book.title : 'no title found';
// }

// function Weather(result) {
//   this.time = new Date(result.ts * 1000).toDateString();
//   this.forecast = result.weather.description;
// }


function errHandler(request, response) {
  response.status(404).render('pages/error');
}


// client.connect()
//   .then(() => {
    app.listen(PORT, () => {
      console.log(`App Listening on port: ${PORT}`);
    });
  // })
  // .catch(error => {
  //   console.log(error);
  // });


// app.listen(PORT, () => {
//   console.log(`now listening on port ${PORT}`);
// });

// Connect to DB and Start the Web Server
// client.connect()
//   .then(() => {
//     app.listen(PORT, () => {
//       console.log('Server up on', PORT);
//       console.log(`Connected to database ${client.connectionParameters.database}`);
//     });
//   })
//   .catch(err => {
//     console.log('ERROR', err);
//   });
