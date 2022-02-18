const express = require('express');
const app = express()
// const session = require('express-session')
let mongoose = require('mongoose');
let cors = require('cors');
let bodyParser = require('body-parser');
let dbConfig = require('./database/db');
require('dotenv').config();
const PORT = process.env.PORT
const MONGODB_URI = process.env.MONGODB_URI
// const MongoDBStore = require('connect-mongodb-session')(session)

// Express Route
const studentRoute = require('./routes/student-route')



// Connecting MongoDB Database
mongoose.Promise = global.Promise;
mongoose.connect(dbConfig.db).then(() => { console.log('Database successfully connected!')},
  error => {
    console.log('Could not connect to database : ' + error)
  })

// const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

// const whiteList = ['http://localhost:3000', 'https://studentmanagement-frontend.herokuapp.com/create-student']
// const corsOptions = {
//   origin: (origin, callback) => {
//     if (allowedURLs.indexOf(origin) >= 0) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
// };

const whitelist = ['http://localhost:3000', 'https://studentmanagement-frontend.herokuapp.com']
const corsOptions = {
  origin: (origin, callback) => {
    if(whitelist.indexOf(origin) !== -1 || !origin){
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}

app.use(cors(corsOptions));


// const SESSION_SECRET = process.env
// app.set('trust proxy, 1')
//
// app.use(session({
//   secret: SESSION_SECRET,
//   resave: false,
//   saveUninitialized: false,
//   store: new MongoDBStore({
//     uri: process.env.PORT,
//     collection: 'mySessions'
//   }),
//   cookie: {
//     sameSite: 'none',
//     secure: true
//   }
// }))


app.use('/students', studentRoute)



// PORT
const port = process.env.PORT || 4000;
const server = app.listen(port, () => { console.log('Connected to port ' + port)})

// 404 Error
app.use((req, res, next) => {
  res.status(404).send('Error 404!')
});

app.use(function (err, req, res, next) {
  console.error(err.message);
  if (!err.statusCode) err.statusCode = 500;
  res.status(err.statusCode).send(err.message);
});
