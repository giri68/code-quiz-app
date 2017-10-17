'use strict';
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const passport = require('passport');

const { router: userRouter } = require('./users');
const { router: quizRouter } = require('./quizzes');
const { router: authRouter, basicStrategy, jwtStrategy } = require('./auth');

const {PORT, CLIENT_ORIGIN} = require('./config');
const {dbConnect} = require('./db-mongoose');
const jwtAuth = passport.authenticate('jwt', { session: false });
// const {dbConnect} = require('./db-knex');

const app = express();

app.use(
  morgan(process.env.NODE_ENV === 'production' ? 'common' : 'dev', {
    skip: (req, res) => process.env.NODE_ENV === 'test'
  })
);

app.use(
  cors({
    origin: CLIENT_ORIGIN
  })
);

app.use('/api/users', userRouter);
app.use('/api/quizzes', quizRouter);
app.use('/api/auth/', authRouter);
app.get('/api/protected', jwtAuth, (req, res) => {
  return res.json({ data: 'rosebud' });
});

app.use('*', (req, res) => {
  return res.status(404).json({ message: 'Not Found' });
});


function runServer(port = PORT) { 
  const server = app
    .listen(port, () => {
      console.info(`App listening on port ${server.address().port}`);
    })
    .on('error', err => {
      console.error('Express failed to start');
      console.error(err);
    });
}

if (require.main === module) {
  dbConnect();
  runServer();
}

module.exports = {app};
