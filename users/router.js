'use strict';
// endpoint is /api/users/

const express = require('express');
const router = express.Router();

const { User, Choice } = require('./models');

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
router.use(jsonParser);
const passport = require('passport');
const jwt = require('jsonwebtoken');
const jwtAuth = passport.authenticate('jwt', { session: false });

function validateUserFields(user) {
  // split this into 3 PURE helper functions
  const stringFields = ['username', 'password', 'firstName', 'lastName'];
  const nonStringField = stringFields.find(
    field => field in user && typeof user[field] !== 'string'
  );

  if (nonStringField) {
    return {
      code: 422,
      reason: 'ValidationError',
      message: 'Incorrect field type: expected string',
      location: nonStringField
    };
  }

  const explicityTrimmedFields = ['username', 'password'];
  const nonTrimmedField = explicityTrimmedFields.find(
    field => user[field].trim() !== user[field]
  );

  if (nonTrimmedField) {
    return {
      code: 422,
      reason: 'ValidationError',
      message: 'Cannot start or end with whitespace',
      location: nonTrimmedField
    };
  }

  const sizedFields = {
    username: { min: 1 },
    password: { min: 10, max: 72 }
  };
  const tooSmallField = Object.keys(sizedFields).find(field =>
    'min' in sizedFields[field] &&
    user[field].trim().length < sizedFields[field].min
  );
  const tooLargeField = Object.keys(sizedFields).find(field =>
    'max' in sizedFields[field] &&
    user[field].trim().length > sizedFields[field].max
  );

  if (tooSmallField || tooLargeField) {
    return {
      code: 422,
      reason: 'ValidationError',
      message: tooSmallField
        ? `Must be at least ${sizedFields[tooSmallField].min} characters long`
        : `Must be at most ${sizedFields[tooLargeField].max} characters long`,
      location: tooSmallField || tooLargeField
    };
  }

  return { valid: true };
}

function confirmUniqueUsername(username) {
  return User.find({ username })
    .count()
    .then(count => {
      if (count > 0) {
        return Promise.reject({
          code: 422,
          reason: 'ValidationError',
          message: 'Username already takken',
          location: 'username'
        });
      } else {
        return Promise.resolve();
      }
    });
}

// create a new user
router.post('/', jsonParser, (req, res) => {
  const requiredFields = ['username', 'password', 'firstName', 'lastName'];
  const missingField = requiredFields.find(field => !(field in req.body));
  console.log('rb', req.body);
  console.log('mf', missingField);
  // only used when creating user
  if (missingField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Missing field',
      location: missingField
    });
  }

  let userValid = {};
  // used whenever changing or creating user
  if (validateUserFields(req.body).valid === true) {
    userValid = req.body;
  } else {
    let code = validateUserFields(req.body).code || 422;
    return res.status(code).json(validateUserFields(req.body));
  }

  let { username, password, lastName, firstName } = userValid;

  return User.find({ username })
    .count()
    .then(count => {
      if (count > 0) {
        return Promise.reject({
          code: 422,
          reason: 'ValidationError',
          message: 'Username already taken',
          location: 'username'
        });
      }
      return User.hashPassword(password);
    })
    .then(hash => {
      return User.create({ username, password: hash, lastName, firstName });
    })
    .then(user => {
      return res.status(201).json(user.apiRepr());
    })
    .catch(err => {
      if (err.reason === 'ValidationError') {
        return res.status(err.code).json(err);
      }
      res.status(500).json({ code: 500, message: 'Internal server error' });
    });
});

router.post('/:id/choices', jsonParser, (req, res)=> {
  //console.log(req.body.favouriteGameId); 
  let userId = req.body.userId;
  let questionId = req.body.questionId;
  let quizId = req.body.quizId;
  let choices = req.body.choices;
  Choice.create({userId, questionId, quizId, choices})
    .then(choice => res.status(204).json(choice))
    .catch(err => {
      res.status(500).json({ message: 'internal server error' });
    });
});

router.put('/:id/choices', jsonParser, (req, res) => {
  // read array of choices from body
  const quizChoices = req.body.choices; //choices are array
  const quizId = req.body.quizId;
  const userId = req.body.userId;
  // loop thru choices array and calculate score
  quizChoices.forEach(choice=>{
    // sort choices by id
    choice.answers.sort((a._id,b._id) => a._id-b._id);
    console.log(choice.answers); 
    return Question.findOne({_id: choice.questionId })
    // get the matching question
    .then((question)=>{
      // get the correct answer from the question
      return question.answers.filter(answer => answer.correct);
    })
    .then((correctAnswers)=>{
      // sort answers by id
      return question.answers.sort((a._id,b._id) => a._id-b._id);      
    })
    .then(correctAnswers => {
      // return true or false;
      return choice.answers === correctAnswers;
    })    
    .then(correct => {
      return res.status(204).send(correct);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ code: 500, message: 'Internal server error' });
    });
})


// access user by id
router.get('/user/:userId', (req, res) => {
  console.log('res', res);
  return User.findById(req.params.userId)
    .then(user => {
      return res.status(200).json(user.apiRepr());
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ code: 500, message: 'Internal server error' });
    });
});

router.get('/choice/:quizId', (req, res) => {
  return Choice.find({quizId: req.params.quizId})
    .then(choice => {
      return res.status(200).json(choice.apiRepr());
    })
    .catch(err => {
      res.status(500).json({ code: 500, message: 'Internal server error' });
      console.log(err);
    });
});
router.get('/', (req, res) => {
  console.log(User.find());
  return User.find()
    .then(users => {
      let usersJSON = users.map(user=>user.apiRepr());
      return res.status(200).json(usersJSON);
    })
    .catch(err => {
      res.status(500).json({ code: 500, message: 'Internal server error' });
    });
});


// delete user
router.delete('/:id', jwtAuth, (req, res) => {
  User
    .findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).end();
    })
    .catch(err => {
      return res.status(500).json({ message: 'something went wrong' });
    });
});

// update a user profile
router.put('/:id', jsonParser, jwtAuth, (req, res) => {

  let userValid = {};
  if (validateUserFields(req.body).valid === true) {
    userValid = req.body;
  } else {
    let code = validateUserFields(req.body).code;
    return res.status(code).json(validateUserFields(req.body));
  }

  return confirmUniqueUsername(userValid.username)
    .then(() => {
      return User.findById(req.params.id)
        .count()
        .then(count => {
          if (count === 0) {
            return Promise.reject({
              code: 422,
              reason: 'ValidationError',
              message: 'User not found',
              location: 'id'
            });
          }
          if (userValid.password) {
            return User.hashPassword(userValid.password);
          } else {
            return '';
          }
        })
        .then((hash) => {
          if (hash) {
            userValid.password = hash;
          }
        })
        .then(() => {
          return User.findByIdAndUpdate(req.params.id,
            { $set: userValid },
            { new: true },
            function (err, user) {
              if (err) return res.send(err);
              res.status(201).json(user.apiRepr());
            }
          );
        });
    })
    .catch(err => {
      if (err.reason === 'ValidationError') {
        return res.status(err.code).json(err);
      }
      res.status(500).json({ code: 500, message: 'Internal server error' });
    });
});

// write another endpoint for user's answers to questions

module.exports = { router };