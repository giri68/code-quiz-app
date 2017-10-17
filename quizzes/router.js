'use strict';
// endpoint is /api/quizzes/

const express = require('express');
const router = express.Router();

const { Quiz } = require('./models');

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
router.get('/:id', (req, res) => {
  return Quiz.findById()
    .then(quiz => {
      return res.status(200).json(quiz.apiRepr());
    })
    .catch(err => {
      res.status(500).json({ code: 500, message: 'Internal server error' });
    });
});

router.get('/', (req, res) => {
  return Quiz.find()
    .then(quiz => {
      return res.status(200).json(quiz.apiRepr());
    })
    .catch(err => {
      res.status(500).json({ code: 500, message: 'Internal server error' });
    });
});

module.exports = { router };