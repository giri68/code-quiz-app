'use strict';

const {router} = require('./router');
console.log('router');
const {basicStrategy, jwtStrategy} = require('./strategies');
console.log('basic',basicStrategy);

module.exports = {router, basicStrategy, jwtStrategy};