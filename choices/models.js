'use strict';

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const ChoiceSchema = mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' },
  choices: [ { type: String } ], // these should match answer ids
  correct: {type: Boolean} // comparison on server side at time of scoring
});

ChoiceSchema.methods.apiRepr = function () {
  return { 
    userId: this.userId,
    questionId: this.questionId,
    quizId: this.quizId,
    choices: this.choices,
    correct: this.correct,
    id: this._id 
  };
};

const Choice = mongoose.models.Choice || mongoose.model('Choice', ChoiceSchema);

module.exports = { Choice };