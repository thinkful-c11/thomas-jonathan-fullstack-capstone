'use strict';

const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');

const { User, Raid } = require('./models');
const {PORT, DATABASE_URL} = require('./config');
const loginRouter = require('./routes/login');
const raidRouter = require('./routes/raid-management');
const userRouter = require('./routes/user-management');

mongoose.Promise = global.Promise;

const app = express();


app.use(morgan('common'));

app.use(express.static('public'));

//set routers
app.use('/login/', loginRouter);
app.use('/raid-management/', raidRouter);
app.use('/user-management', userRouter);


app.get('/raid', (req, res) => {
  return Raid
    .find()
    .populate(['leader', 'applicants', 'paladin', 'warrior', 'darkKnight', 'whiteMage', 'scholar', 'astrologian', 'ninja', 'dragoon', 'samurai', 'monk', 'redMage', 'summoner', 'blackMage', 'bard', 'machinist'])
    .exec()
    .then(arrayOfTeams => {
      res.json(arrayOfTeams.map(
          (team) => team.apiRepr()
        )
      );
    })
    .catch(err => {
      res.send(err);
    });
});

app.get('/user', (req, res) => {
  return User
    .find()
    .populate('team')
    .exec()
    .then(users => {
      res.json(users.map(
          (user) => user.apiRepr()
        )
      );
    })
    .catch(err => {
      res.send(err);
    });
});

// app.listen(process.env.PORT || 8080);


// Server stuff
let server;

// this function connects to our database, then starts the server
function runServer(databaseUrl=DATABASE_URL, port = PORT) {

  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if (err) {
        return reject(err);
      }
      server = app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        resolve();
      })
      .on('error', err => {
        mongoose.disconnect();
        reject(err);
      });
    });
  });
}

// this function closes the server, and returns a promise. we'll
// use it in our integration tests later.
function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log('Closing server');
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}

// if server.js is called directly (aka, with `node server.js`), this block
// runs. but we also export the runServer command so other code (for instance, test code) can start the server as needed.
if (require.main === module) {
  runServer().catch(err => console.error(err));
}

module.exports = {app, runServer, closeServer};
