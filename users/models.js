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
    name: { type: String },
    total: { type: Number },
    completed: { type: Number },
    correct: { type: Number },
  }],
  badges: { type: String },
  recent: [{type: String}]
});

UserSchema.methods.apiRepr = function () {
  return { 
    firstName: this.firstName,
    lastName: this.lastName,
    username: this.username,
    quizzes: this.quizzes, 
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

const ChoiceSchema = mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' },
  choices: [{ id: { type: String } }], // these should match answer ids
  correct: {type: Boolean} // comparison on server side at time of scoring
});

ChoiceSchema.methods.apiRepr = function () {
  return { 
    userId: this.firstName,
    questionId: this.lastName,
    quizId: this.username,
    choices: this.choices,
    correct: this.correct,
    id: this._id 
  };
};

const Choice = mongoose.models.Choice || mongoose.model('Choice', ChoiceSchema);

module.exports = { User, Choice };
