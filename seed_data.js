'use strict';
const express = require('express');

const {PORT, DATABASE_URL} = require('./config');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const app = express();

const { Quiz, Question } = require('./quizzes');
const { User, Choice } = require('./users');

const listOfQuizzes = [
  {
    name: 'HTML Basic',
    description: 'This is a quiz of HTML',
    category: 'HTML',
    difficulty: 1,
  }, 
  { 
    name: 'CSS Basic',
    description: 'This is a quiz of CSS',
    category: 'CSS',
    difficulty: 1,
  },
  {
    name: 'JS Basic',
    description: 'This is a quiz of HTML',
    category: 'JS',
    difficulty: 1,
  }, 
  { 
    name: 'jQuery Quiz',
    description: 'Are you still using that?',
    category: 'JS',
    difficulty: 2,
  },  {
    name: 'React Quiz',
    description: 'Oh yeah!',
    category: 'JS',
    difficulty: 3,
  }, 
  { 
    name: 'HTML a11y',
    description: 'Learn it! Use it!',
    category: 'HTML',
    difficulty: 2,
  }
];


const listOfQuestions = [
  // @@@@@@@@@@@@ 1ST LIST OF QUESTIONS @@@@@@@@@
  // @@@@@@@@@@@@ HTML QUIZ @@@@@@@@@
  [
    {
      inputType: 'checkbox', 
      question: 'What is a DOM?',
      answers: [{
        option: 'Document Object Model',
        correct: true,
      },
      {
        option: 'Name of Dog',
        correct: false,
      },
      {
        option: 'Mobster Name',
        correct: false,
      },
      {
        option: 'Department of Ministry',
        correct: false,
      }
      ]
    },
    {
      inputType: 'checkbox', 
      question: 'What is a HTML5?',
      answers: [{
        option: 'name of HTML',
        correct: false,
      },
      {
        option: 'version of HTML',
        correct: true,
      },
      {
        option: 'Structure of HTML',
        correct: false,
      },
      {
        option: 'name of DOM',
        correct: false,
      }
      ]
    },
    {
      inputType: 'checkbox', 
      question: 'What is a semantic HTML?',
      answers: [{
        option: 'Name of HTML tag',
        correct: false,
      },
      {
        option: 'HTML version',
        correct: false,
      },
      {
        option: 'Meaning and Information of the webpage',
        correct: true,
      },
      {
        option: 'use of HTML',
        correct: false,
      }
      ]
    }
  ], // END ARRAY OF QUESTIONS
  // @@@@@@@@@@@@ 2ND LIST OF QUESTIONS @@@@@@@@@
  // @@@@@@@@@@@@ CSS QUIZ @@@@@@@@@
  [
    {
      inputType: 'checkbox', 
      question: 'What is a CSS?',
      answers: [{
        option: 'Cascading Style Sheet',
        correct: true,
      },
      {
        option: 'Customer style sheet',
        correct: false,
      },
      {
        option: 'Version of style sheet',
        correct: false,
      },
      {
        option: 'use of style sheet',
        correct: false,
      }
      ]
    },
    {
      inputType: 'checkbox', 
      question: 'Why is CSS used?',
      answers: [{
        option: 'For layout of webpage',
        correct: false,
      },
      {
        option: 'styling to the web page',
        correct: true,
      },
      {
        option: 'conect with the database',
        correct: false,
      },
      {
        option: 'to connect JQuery',
        correct: false,
      }
      ]
    },
    {
      inputType: 'checkbox', 
      question: 'What does \'Cascade\' refer to?',
      answers: [{
        option: 'Dishwashing liqud',
        correct: false,
      },
      {
        option: 'A place to whitewater raft',
        correct: false,
      },
      {
        option: 'The most confusing rule of CSS property assignment',
        correct: true,
      },
      {
        option: 'What CSS does when it breaks',
        correct: false,
      }
      ]
    },
    {
      inputType: 'checkbox', 
      question: 'How do you use hex colors in CSS?',
      answers: [{
        option: 'Doesn\'t matter as long as you use 6',
        correct: false,
      },
      {
        option: '#abc',
        correct: true,
      },
      {
        option: '#80fc53',
        correct: true,
      },
      {
        option: 'CSS doesn\'t use hex colors',
        correct: false,
      }
      ]
    },
    {
      inputType: 'checkbox', 
      question: 'What is relative positioning?',
      answers: [{
        option: 'That\'s physics, not CSS',
        correct: false,
      },
      {
        option: 'Offset from static positioning',
        correct: true,
      },
      {
        option: 'A way to float the darkest colors to the front',
        correct: false,
      },
      {
        option: 'A way to get ahead in front-end development',
        correct: false,
      }
      ]
    }
  ], // END ARRAY OF QUESTIONS
  // @@@@@@@@@@@@ 3RD LIST OF QUESTIONS @@@@@@@@@
  // @@@@@@@@@@@@ JS BASIC QUIZ @@@@@@@@@
  [
    {
      inputType: 'checkbox', 
      question: 'What is a DOM?',
      answers: [{
        option: 'Document Object Model',
        correct: true,
      },
      {
        option: 'Name of Dog',
        correct: false,
      },
      {
        option: 'Mobster Name',
        correct: false,
      },
      {
        option: 'Department of Ministry',
        correct: false,
      }
      ]
    },
    {
      inputType: 'checkbox', 
      question: 'What is a HTML5?',
      answers: [{
        option: 'name of HTML',
        correct: false,
      },
      {
        option: 'version of HTML',
        correct: true,
      },
      {
        option: 'Structure of HTML',
        correct: false,
      },
      {
        option: 'name of DOM',
        correct: false,
      }
      ]
    },
    {
      inputType: 'checkbox', 
      question: 'What is a semantic HTML?',
      answers: [{
        option: 'Name of HTML tag',
        correct: false,
      },
      {
        option: 'HTML version',
        correct: false,
      },
      {
        option: 'Meaning and Information of the webpage',
        correct: true,
      },
      {
        option: 'use of HTML',
        correct: false,
      }
      ]
    }
  ], // END ARRAY OF QUESTIONS
  // @@@@@@@@@@@@ 4TH LIST OF QUESTIONS @@@@@@@@@
  // @@@@@@@@@@@@ JQUER QUIZ @@@@@@@@@
  [
    {
      inputType: 'checkbox', 
      question: 'What is a CSS?',
      answers: [{
        option: 'Cascading Style Sheet',
        correct: true,
      },
      {
        option: 'Customer style sheet',
        correct: false,
      },
      {
        option: 'Version of style sheet',
        correct: false,
      },
      {
        option: 'use of style sheet',
        correct: false,
      }
      ]
    },
    {
      inputType: 'checkbox', 
      question: 'Why is CSS used?',
      answers: [{
        option: 'For layout of webpage',
        correct: false,
      },
      {
        option: 'styling to the web page',
        correct: true,
      },
      {
        option: 'conect with the database',
        correct: false,
      },
      {
        option: 'to connect JQuery',
        correct: false,
      }
      ]
    },
    {
      inputType: 'checkbox', 
      question: 'What does \'Cascade\' refer to?',
      answers: [{
        option: 'Dishwashing liqud',
        correct: false,
      },
      {
        option: 'A place to whitewater raft',
        correct: false,
      },
      {
        option: 'The most confusing rule of CSS property assignment',
        correct: true,
      },
      {
        option: 'What CSS does when it breaks',
        correct: false,
      }
      ]
    },
    {
      inputType: 'checkbox', 
      question: 'How do you use hex colors in CSS?',
      answers: [{
        option: 'Doesn\'t matter as long as you use 6',
        correct: false,
      },
      {
        option: '#abc',
        correct: true,
      },
      {
        option: '#80fc53',
        correct: true,
      },
      {
        option: 'CSS doesn\'t use hex colors',
        correct: false,
      }
      ]
    },
    {
      inputType: 'checkbox', 
      question: 'What is relative positioning?',
      answers: [{
        option: 'That\'s physics, not CSS',
        correct: false,
      },
      {
        option: 'Offset from static positioning',
        correct: true,
      },
      {
        option: 'A way to float the darkest colors to the front',
        correct: false,
      },
      {
        option: 'A way to get ahead in front-end development',
        correct: false,
      }
      ]
    }
  ], // END ARRAY OF QUESTIONS
  // @@@@@@@@@@@@ 5TH LIST OF QUESTIONS @@@@@@@@@
  // @@@@@@@@@@@@ REACT QUIZ @@@@@@@@@
  [
    {
      inputType: 'checkbox', 
      question: 'What is a DOM?',
      answers: [{
        option: 'Document Object Model',
        correct: true,
      },
      {
        option: 'Name of Dog',
        correct: false,
      },
      {
        option: 'Mobster Name',
        correct: false,
      },
      {
        option: 'Department of Ministry',
        correct: false,
      }
      ]
    },
    {
      inputType: 'checkbox', 
      question: 'What is a HTML5?',
      answers: [{
        option: 'name of HTML',
        correct: false,
      },
      {
        option: 'version of HTML',
        correct: true,
      },
      {
        option: 'Structure of HTML',
        correct: false,
      },
      {
        option: 'name of DOM',
        correct: false,
      }
      ]
    },
    {
      inputType: 'checkbox', 
      question: 'What is a semantic HTML?',
      answers: [{
        option: 'Name of HTML tag',
        correct: false,
      },
      {
        option: 'HTML version',
        correct: false,
      },
      {
        option: 'Meaning and Information of the webpage',
        correct: true,
      },
      {
        option: 'use of HTML',
        correct: false,
      }
      ]
    }
  ], // END ARRAY OF QUESTIONS
  // @@@@@@@@@@@@ 6TH LIST OF QUESTIONS @@@@@@@@@
  // @@@@@@@@@@@@ A11Y QUIZ @@@@@@@@@
  [
    {
      inputType: 'checkbox', 
      question: 'What is a CSS?',
      answers: [{
        option: 'Cascading Style Sheet',
        correct: true,
      },
      {
        option: 'Customer style sheet',
        correct: false,
      },
      {
        option: 'Version of style sheet',
        correct: false,
      },
      {
        option: 'use of style sheet',
        correct: false,
      }
      ]
    },
    {
      inputType: 'checkbox', 
      question: 'Why is CSS used?',
      answers: [{
        option: 'For layout of webpage',
        correct: false,
      },
      {
        option: 'styling to the web page',
        correct: true,
      },
      {
        option: 'conect with the database',
        correct: false,
      },
      {
        option: 'to connect JQuery',
        correct: false,
      }
      ]
    },
    {
      inputType: 'checkbox', 
      question: 'What does \'Cascade\' refer to?',
      answers: [{
        option: 'Dishwashing liqud',
        correct: false,
      },
      {
        option: 'A place to whitewater raft',
        correct: false,
      },
      {
        option: 'The most confusing rule of CSS property assignment',
        correct: true,
      },
      {
        option: 'What CSS does when it breaks',
        correct: false,
      }
      ]
    },
    {
      inputType: 'checkbox', 
      question: 'How do you use hex colors in CSS?',
      answers: [{
        option: 'Doesn\'t matter as long as you use 6',
        correct: false,
      },
      {
        option: '#abc',
        correct: true,
      },
      {
        option: '#80fc53',
        correct: true,
      },
      {
        option: 'CSS doesn\'t use hex colors',
        correct: false,
      }
      ]
    },
    {
      inputType: 'checkbox', 
      question: 'What is relative positioning?',
      answers: [{
        option: 'That\'s physics, not CSS',
        correct: false,
      },
      {
        option: 'Offset from static positioning',
        correct: true,
      },
      {
        option: 'A way to float the darkest colors to the front',
        correct: false,
      },
      {
        option: 'A way to get ahead in front-end development',
        correct: false,
      }
      ]
    }
  ], // END ARRAY OF QUESTIONS
];

// This works, but Mongo is auto-populating sub-document IDs, so not needed.
// listOfQuizzes.forEach((quiz, index)=>{
//   quiz.questions.id = index;
//   quiz.questions.forEach((question, index) => {
//     question.id = index;
//     question.answers.forEach((answer, index) => {
//       answer.id = index;
//     });
//   });
// });

function dbConnect(url = DATABASE_URL) {
  return mongoose.connect(DATABASE_URL, {useMongoClient: true}).catch(err => {
    console.error('Mongoose failed to connect');
    console.error(err);
  });
}
  
let server;
  
function runServer(url = DATABASE_URL, port = PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(url, { useMongoClient: true }, err => {
      if (err) {
        return reject(err);
      }
      server = app
        .listen(port, () => {
          console.log(`Your app is listening on port ${port}`);
          resolve();
        })
        .on('error', err => {
          mongoose.disconnect();
          reject(err);
        });
    });
  });
}

return runServer()   
  .then(()=> {
    const arrayOfPromises = listOfQuizzes.map((quiz, idx)=>{
      return Quiz.create(listOfQuizzes[idx]);
    });
    return Promise.all(arrayOfPromises);
  })
  .then((quizzes)=> {
    // console.log(quizzes);
    return quizzes.map(quiz=>quiz._id);
  })
  .then((ids)=>{
    return listOfQuestions.forEach((questionArray, index)=>{
      questionArray.forEach((question) => {
        question.quizId = ids[index];
      });
    });
  })
  .then(()=> {
    const arrayOfQuestionPromises = listOfQuestions.map((question, idx)=>{
      return Question.insertMany(listOfQuestions[idx]); // insertMany because inner array
    });
    return Promise.all(arrayOfQuestionPromises);
  })
  .then(questions => {
    // console.log('questions',questions);
    console.log('SUCCESS! CHECK YOUR DATABASE!!');
  })
  .catch(err => {
    console.log(err);
  });

  // router.put('/:questionId', jsonParser, jwtAuth, (req, res) => {
  //   Question
  //     .findByIdAndUpdate(req.params.questionId, {
  //       $set: {
  //         question:req.body.question,
  //         inputType: req.body.inputType,
  //         answers: req.body.answers
  //       }
  //     })
  //     .then(game => res.status(204).end())
  //     .catch(err => res.status(500).json({ message: 'Internal server error' }));
  // });

  // delete entire quiz
// router.delete('/:quizId', jwtAuth, (req, res) => {
//   Quiz
//     .findByIdAndRemove(req.params.quizid)
//     .then(quiz => res.status(204).end())
//     .catch(err => res.status(500).json({ message: 'Internal server error' }));
// });

// // delete a question
// router.delete('/:questionId', jwtAuth, (req, res) => {
//   Question
//     .findByIdAndRemove(req.params.questionId)
//     .then(quiz => res.status(204).end())
//     .catch(err => res.status(500).json({ message: 'Internal server error' }));
// });