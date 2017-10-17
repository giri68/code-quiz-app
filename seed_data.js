'use strict';
const express = require('express');

const {PORT, DATABASE_URL} = require('./config');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const app = express();

const { Quiz } = require('./quizzes');
const { User } = require('./users');

const listOfQuizzes = [
  {
    name: 'HTML Quiz',
    description: 'This is a quiz of HTML',
    category: 'HTML',
    difficulty: 1,
    questions: [{
      inputType: 'checkbox', 
      question: 'What is a DOM?',
      answers: [{
        answer: 'Document Object Model',
        correct: true,
      },
      {
        answer: 'Name of Dog',
        correct: false,
      },
      {
        answer: 'Mobster Name',
        correct: false,
      },
      {
        answer: 'Department of Ministry',
        correct: false,
      }
      ]
    },
    {
      inputType: 'checkbox', 
      question: 'What is a HTML5?',
      answers: [{
        answer: 'name of HTML',
        correct: false,
      },
      {
        answer: 'version of HTML',
        correct: true,
      },
      {
        answer: 'Structure of HTML',
        correct: false,
      },
      {
        answer: 'name of DOM',
        correct: false,
      }
      ]
    },
    {
      inputType: 'checkbox', 
      question: 'What is a semantic HTML?',
      answers: [{
        answer: 'Name of HTML tag',
        correct: false,
      },
      {
        answer: 'HTML version',
        correct: false,
      },
      {
        answer: 'Meaning and Information of the webpage',
        correct: true,
      },
      {
        answer: 'use of HTML',
        correct: false,
      }
      ]
    }
    ] // end of array of questions
  }, // end of quiz
  { // start new quiz
    name: 'CSS Quiz',
    description: 'This is a quiz of CSS',
    category: 'CSS',
    difficulty: 1,
    questions: [{
      inputType: 'checkbox', 
      question: 'What is a CSS?',
      answers: [{
        answer: 'Cascading Style Sheet',
        correct: true,
      },
      {
        answer: 'Customer style sheet',
        correct: false,
      },
      {
        answer: 'Version of style sheet',
        correct: false,
      },
      {
        answer: 'use of style sheet',
        correct: false,
      }
      ]
    },
    {
      inputType: 'checkbox', 
      question: 'Why is CSS used?',
      answers: [{
        answer: 'For layout of webpage',
        correct: false,
      },
      {
        answer: 'styling to the web page',
        correct: true,
      },
      {
        answer: 'conect with the database',
        correct: false,
      },
      {
        answer: 'to connect JQuery',
        correct: false,
      }
      ]
    },
    {
      inputType: 'checkbox', 
      question: 'What does \'Cascade\' refer to?',
      answers: [{
        answer: 'Dishwashing liqud',
        correct: false,
      },
      {
        answer: 'A place to whitewater raft',
        correct: false,
      },
      {
        answer: 'The most confusing rule of CSS property assignment',
        correct: true,
      },
      {
        answer: 'What CSS does when it breaks',
        correct: false,
      }
      ]
    },
    {
      inputType: 'checkbox', 
      question: 'How do you use hex colors in CSS?',
      answers: [{
        answer: 'Doesn\'t matter as long as you use 6',
        correct: false,
      },
      {
        answer: '#abc',
        correct: true,
      },
      {
        answer: '#80fc53',
        correct: true,
      },
      {
        answer: 'CSS doesn\'t use hex colors',
        correct: false,
      }
      ]
    },
    {
      inputType: 'checkbox', 
      question: 'What is relative positioning?',
      answers: [{
        answer: 'That\'s physics, not CSS',
        correct: false,
      },
      {
        answer: 'Offset from static positioning',
        correct: true,
      },
      {
        answer: 'A way to float the darkest colors to the front',
        correct: false,
      },
      {
        answer: 'A way to get ahead in front-end development',
        correct: false,
      }
      ]
    }
    ]
  }];

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
    Quiz.insertMany(listOfQuizzes)
      .then(quizzes => {
        console.log('SUCCESS! CHECK YOUR DATABASE!!');
      })
      .catch(err => {
        console.log(err);
      });
  });