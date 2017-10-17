'use strict';

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;



const QuizSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: { type: String },
  questions: [{
    id: { type: Number }, // where set ObjectId()??
    question: { type: String },
    answers: [{
      answer: { type: String },
      correct: { type: Boolean },
      id: { type: Number }, // where do we set ObjectId()?
    }] // end answers array
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
