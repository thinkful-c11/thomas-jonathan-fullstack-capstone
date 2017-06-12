'use strict';

const express = require('express');
const morgan = require('morgan');

const loginRouter = require('./routes/login');

const app = express();


app.use(morgan('common'));

app.use(express.static('public'));

//set routers
app.use('/login/', loginRouter);






app.listen(process.env.PORT || 8080);


//Server stuff
// let server;
// function runServer(database = DATABASE, port = PORT) {
//   return new Promise((resolve, reject) => {
//     try {
//       knex = require('knex')(database);
//       server = app.listen(port, () => {
//         console.info(`App listening on port ${server.address().port}`);
//         resolve();
//       });
//     }
//     catch (err) {
//       console.error(`Can't start server: ${err}`);
//       reject(err);
//     }
//   });
// }
//
// function closeServer() {
//   return knex.destroy().then(() => {
//     return new Promise((resolve, reject) => {
//       console.log('Closing servers');
//       server.close(err => {
//         if (err) {
//           return reject(err);
//         }
//         resolve();
//       });
//     });
//   });
// }
//
//
// if (require.main === module) {
//   runServer().catch(err => {
//     console.error(`Can't start server: ${err}`);
//     throw err;
//   });
// }
//
module.exports = { app };
