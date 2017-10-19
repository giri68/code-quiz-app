'use strict';
// endpoint is /api/choices/
// index: helpers, post, get (no put, no delete)

const express = require('express');
const router = express.Router();

const { User, Choice } = require('./models');
const { Question } = require('../quizzes');

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
router.use(jsonParser);
const passport = require('passport');
const jwt = require('jsonwebtoken');
const jwtAuth = passport.authenticate('jwt', { session: false });


// CHECK THIS WITH MULTIPLES
const formatQuestionOptionIds = question => {
  let correct = question.answers.filter(answer => answer.correct);
  console.log('correct',correct);                
  let correct_id = correct.map(answer=>String(answer._id));
  console.log('correct_id',correct_id);  
  let correctSort = correct_id.sort((a,b)=>a-b);   
  console.log('correctSort',correctSort); 
  let correctJoin = correctSort.join(', ');   
  console.log('correctJoin',correctJoin); 
  return correctJoin;
};

// post choice (answer a question)
router.post('/', jsonParser, (req, res)=> {
  let makeSureReqBodyHasThisFormat =  {
    "userId": "59e51b41c5944e09d2bc9036",
    "questionId": "59e651e1c7bea3a51c15d900",
    "quizId": "59e651e1c7bea3a51c15d8fe",
    "choices" : [ "59e651e1c7bea3a51c15d904", "59e651e1c7bea3a51c15d905" ]
  };
  let userId = req.body.userId;
  let questionId = req.body.questionId;
  let quizId = req.body.quizId;
  let choices = req.body.choices;
  console.log('choices var', choices);
  
  let formattedChoices = (choices).sort((a,b) => a-b).join(','); 
  let choiceId;
  let isCorrect;
  return Choice.create({userId, questionId, quizId, choices})  // enter choice in db
    .then(choice => {
      console.log('choiceCreated',choice);
      choiceId = choice._id;                                  // save & hoist id of choice created
      console.log('saved choice._id',choice._id);
      return Question.findById( questionId );                 // find associated question
    })
    .then(question=>formatQuestionOptionIds(question))       // format answers as a sorted string
    .then(questionIds=> {
      console.log('questionIds', questionIds);
      console.log('formattedChoices', formattedChoices);
      return isCorrect = questionIds === formattedChoices;   // compare, return true or false, hoist
    })    
    .then(correct => {
      return Choice.findByIdAndUpdate(choiceId, { $set: {correct: isCorrect} }, { new: true });
    })
    .then(correct => res.status(200).json(isCorrect))          // return true or false
    .catch(err => {
      console.log(err);
      res.status(500).json({ code: 500, message: 'Internal server error' });
    });
});

// get choice by quiz id and user id
router.get('/quizzes/:quizId/users/:userId', (req, res) => {
  return Choice.find({quizId: req.params.quizId})
    .then(choice => { // UPDATE ENDPOINT TO FORMAT ARRAY
      return res.status(200).json(choice.apiRepr());
    })
    .catch(err => {
      res.status(500).json({ code: 500, message: 'Internal server error' });
      console.log(err);
    });
});

module.exports = { router };