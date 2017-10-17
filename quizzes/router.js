'use strict';
// endpoint is /api/quizzes/

const express = require('express');
const router = express.Router();

const { Quiz, Question } = require('./models');

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
router.use(jsonParser);
const passport = require('passport');
const jwt = require('jsonwebtoken');
const jwtAuth = passport.authenticate('jwt', { session: false });

// create a new quiz AUTHENTICATE THIS ONE
router.post('/', jsonParser, (req, res) => {
  // validate body of post
  // validate quiz name
  let name = req.body.name;
  // validate description
  let description = req.body.description;
  //validate questions, including questions.question, questions.answers.correct
  let questions = req.body.questions;
  //validated
  Quiz.create({ name, description, questions })
    .then(quiz => {
      return res.status(201).json(quiz.apiRepr());
    })
    .catch(err => {
      if (err.reason === 'ValidationError') {
        return res.status(err.code).json(err);
      }
      res.status(500).json({ code: 500, message: 'Internal server error' });
    });
});

// create put endpoint(s) to update quiz, including add comments (after MVP)

// access quiz by id (load entire quiz array, then user cycles through array)
router.get('quiz/:quizId', (req, res) => {
  return Quiz.findById(req.params.quizId)
    .then(quiz => {
      return res.status(200).json(quiz.apiRepr());
    })
    .catch(err => {
      res.status(500).json({ code: 500, message: 'Internal server error' });
    });
});

router.get('/question/:quizId', (req, res) => {
  
  return Question.find({quizId: req.params.quizId})
  
    .then(questions => {
      return res.status(200).json(questions);
    })
    .catch(err => {
      res.status(500).json({ code: 500, message: 'Internal server error' });
    });
});



router.get('/', (req, res) => {
  return Quiz.find()
    .then(quizzes => {
      let quizzesArray = quizzes.map(quiz => quiz.apiRepr());
      return res.status(200).json(quizzesArray);
    })
    .catch(err => {
      res.status(500).json({ code: 500, message: 'Internal server error' });
    });
});



router.put('/:quizId', jsonParser, jwtAuth, (req, res) => {
  Quiz
    .findByIdAndUpdate(req.params.quizid, {
      $set: {
        name:req.body.name,
        description: req.body.description,
        category: req.body.category,
        difficulty: req.body.difficulty,
        questions: req.body.questions
      }
    })
    .then(game => res.status(204).end())
    .catch(err => res.status(500).json({ message: 'Internal server error' }));
});

router.put('/:questionId', jsonParser, jwtAuth, (req, res) => {
  Question
    .findByIdAndUpdate(req.params.questionId, {
      $set: {
        question:req.body.question,
        inputType: req.body.inputType,
        answers: req.body.answers
      }
    })
    .then(game => res.status(204).end())
    .catch(err => res.status(500).json({ message: 'Internal server error' }));
});


router.delete('/:quizId', jwtAuth, (req, res) => {
  Quiz
    .findByIdAndRemove(req.params.quizid)
    .then(quiz => res.status(204).end())
    .catch(err => res.status(500).json({ message: 'Internal server error' }));
});
router.delete('/:questionId', jwtAuth, (req, res) => {
  Question
    .findByIdAndRemove(req.params.questionId)
    .then(quiz => res.status(204).end())
    .catch(err => res.status(500).json({ message: 'Internal server error' }));
});

module.exports = { router };