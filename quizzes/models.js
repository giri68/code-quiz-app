'use strict';

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const QuestionSchema = mongoose.Schema({
  question: { type: String },
  inputType: { type: String }, // radio, checkbox, text
  answers: [{
    answer: { type: String },
    correct: { type: Boolean },
    id: { type: Number }, // Mongo is currently creating ObjectId here...
  }]
});

QuestionSchema.methods.apiRepr = function () {
  return { 
    answers: this.answers.map(answer=>delete answer.correct), // figure out how to mask answers.correct
    inputType: this.inputType,
    question: this.question,
    id: this._id };
};

const QuizSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: { type: String },
  category: { type: String }, // HTML, CSS, JS
  difficulty: { type: Number }, // scale of 1 easy 5 advanced
  questions: [{
    id: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' }
  }] // end questions array
});

QuizSchema.methods.apiRepr = function () {
  return { 
    name: this.name,
    description: this.description,
    questions: this.questions,
    id: this._id };
};

const Quiz = mongoose.models.User || mongoose.model('Quiz', QuizSchema);

module.exports = { Quiz };
