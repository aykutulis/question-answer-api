const express = require('express');
const answer = require('./answer');
const { getAccessToRoute, getQuestionOwnerAccess } = require('../middlewares/authorization/auth');
const { checkQuestionExist } = require('../middlewares/database/databaseErrorHandler');
const questionQuery = require('../middlewares/query/questionQuery');
const answerQuery = require('../middlewares/query/answerQuery');
const Question = require('../models/Question');
const {
  askNewQuestion,
  getAllQuestions,
  getSingleQuestion,
  editQuestion,
  deleteQuestion,
  likeQuestion,
  undoLikeQuestion,
} = require('../controllers/question');

const router = express.Router();

// /api/questions
router.get(
  '/:id',
  [
    checkQuestionExist,
    answerQuery([
      {
        path: 'user',
        select: 'name profile_image',
      },
      {
        path: 'answers',
        select: 'content',
      },
    ]),
  ],
  getSingleQuestion
);
router.get('/', questionQuery(Question, { population: { path: 'user', select: 'name profile_image' } }), getAllQuestions);
router.post('/ask', getAccessToRoute, askNewQuestion);
router.put('/:id/edit', [getAccessToRoute, checkQuestionExist, getQuestionOwnerAccess], editQuestion);
router.delete('/:id/delete', [getAccessToRoute, checkQuestionExist, getQuestionOwnerAccess], deleteQuestion);
router.get('/:id/like', [getAccessToRoute, checkQuestionExist], likeQuestion);
router.get('/:id/undo_like', [getAccessToRoute, checkQuestionExist], undoLikeQuestion);

router.use('/:question_id/answers', checkQuestionExist, answer);

module.exports = router;
