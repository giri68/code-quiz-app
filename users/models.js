'use strict';

const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const UserSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  quizzes: [{
    id: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' },
    questions: [{
      id: { type: String }, // is this right, if we store ObjectId()???
      answers: [{
        id: { type: String }, // same question
      }] // end answers array
    }] // end questions array
  }] // end quizzes array
});

UserSchema.methods.apiRepr = function () {
  return { 
    firstName: this.firstName,
    lastName: this.lastName,
    username: this.username,
    // quizzes: this.quizzes, // maybe just show name of quiz? 
    id: this._id 
  };
};

UserSchema.methods.validatePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

UserSchema.statics.hashPassword = function (password) {
  return bcrypt.hash(password, 10);
};

const User = mongoose.models.User || mongoose.model('User', UserSchema);

module.exports = { User };
