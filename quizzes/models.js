'use strict';

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const QuestionSchema = mongoose.Schema({
  question: { type: String },
  inputType: { type: String }, // radio, checkbox, text
  answers: [{
    option: { type: String },
    correct: { type: Boolean },
    id: { type: Number }, // Mongo is currently creating ObjectId here...
  }],
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' } // each question belongs to 1 only quiz
});

QuestionSchema.methods.apiRepr = function () {
  return { 
    options: this.option.map(option=>delete option.correct), // figure out how to mask answers.correct
    inputType: this.inputType,
    question: this.question,
    id: this._id };
};

const Question = mongoose.models.Question || mongoose.model('Question', QuestionSchema);

const QuizSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: { type: String },
  category: { type: String }, // HTML, CSS, JS
  difficulty: { type: Number }, // scale of 1 easy 5 advanced
});

QuizSchema.methods.apiRepr = function () {
  return { 
    name: this.name,
    description: this.description,
    id: this._id };
};

const Quiz = mongoose.models.Quiz || mongoose.model('Quiz', QuizSchema);

module.exports = { Quiz, Question };
