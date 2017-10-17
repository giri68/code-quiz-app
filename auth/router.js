'use strict';
// endpoint: /api/auth/

const express = require('express');
const router = express.Router();
const config = require('../config');
const passport = require('passport');
const jwt = require('jsonwebtoken');
console.log('before auth token');

const createAuthToken = function (user) {
  return jwt.sign({ user }, config.JWT_SECRET, {
    subject: user.username,
    expiresIn: config.JWT_EXPIRY,
    algorithm: 'HS256'
  });
};

console.log('basic');

const basicAuth = passport.authenticate('basic', { session: false });
const jwtAuth = passport.authenticate('jwt', { session: false });
console.log('basicAuth',basicAuth);

router.post('/login', basicAuth, (req, res) => {
  console.log('ATTEMPTING TO LOG IN');
  const authToken = createAuthToken(req.user.apiRepr());
  res.json({ authToken });
});

router.post('/refresh', jwtAuth, (req, res) => {
  const authToken = createAuthToken(req.user);
  res.json({ authToken });
});

module.exports = { router };
