const express = require('express');
const { getAccessToRoute, getAnswerOwnerAccess } = require('../middlewares/authorization/auth');
const { checkQuestionAndAnswerExist } = require('../middlewares/database/databaseErrorHandler');
const {
  addNewAnswerToQuestion,
  getAllAnswerByQuestion,
  getSingleAnswer,
  editAnswer,
  deleteAnswer,
  likeAnswer,
  undoLikeAnswer,
} = require('../controllers/answer');

const router = express.Router({ mergeParams: true });

router.get('/', getAllAnswerByQuestion);
router.post('/', getAccessToRoute, addNewAnswerToQuestion);
router.get('/:answer_id', checkQuestionAndAnswerExist, getSingleAnswer);
router.get('/:answer_id/like', [checkQuestionAndAnswerExist, getAccessToRoute], likeAnswer);
router.get('/:answer_id/undo_like', [checkQuestionAndAnswerExist, getAccessToRoute], undoLikeAnswer);
router.put('/:answer_id/edit', [checkQuestionAndAnswerExist, getAccessToRoute, getAnswerOwnerAccess], editAnswer);
router.delete('/:answer_id/delete', [checkQuestionAndAnswerExist, getAccessToRoute, getAnswerOwnerAccess], deleteAnswer);

module.exports = router;
