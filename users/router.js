'use strict';
// endpoint is /api/users/

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

// CHECK THIS WITH MULTIPLES
const formatChoiceIds = choices => {
  console.log('choicesRaw',choices); 
  let choicesClean = choices.map(choice => choice.optionId);
  console.log('choicesClean',choicesClean); 
  let choicesSort = choicesClean.sort((a,b) => a-b);
  console.log('choicesSort',choicesSort); 
  let choicesJoin = choicesSort.join(', ');   
  console.log('choicesJoin',choicesJoin); 
  return choicesJoin;
};

router.post('/choices', jsonParser, (req, res)=> {
  let makeSureReqBodyHasThisFormat =  {
    "userId": "59e51b41c5944e09d2bc9036",
    "questionId": "59e651e1c7bea3a51c15d900",
    "quizId": "59e651e1c7bea3a51c15d8fe",
    "choices" : [
      {"optionId" : "59e651e1c7bea3a51c15d904"},
      {"optionId" : "59e651e1c7bea3a51c15d905"},
    ]
  };
  let userId = req.body.userId;
  let questionId = req.body.questionId;
  let quizId = req.body.quizId;
  let choices = req.body.choices;             
  let formattedChoices = formatChoiceIds(choices);          // format choice ids as sorted string
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

// WE DON'T NEED THIS ANYMORE! ;)
// router.put('/choices/:id', jsonParser, (req, res) => {
//   console.log(req.body);
//   return Question.findOne({_id: req.body.questionId })
//     .then(question=>formatQuestionOptionIds(question))
//     .then(questionIds=> questionIds === formatChoiceIds(req.body.choiceIds))
//     .then(correct => res.status(200).send(correct))
//     .catch(err => {
//       console.log(err);
//       res.status(500).json({ code: 500, message: 'Internal server error' });
//     });
// });

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