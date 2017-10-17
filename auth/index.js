'use strict';

const {router} = require('./router');

const {basicStrategy, jwtStrategy} = require('./strategies');
console.log('basic',basicStrategy);

module.exports = {router, basicStrategy, jwtStrategy};