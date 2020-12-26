const asyncHandler = require('express-async-handler');
const User = require('../../models/User');
const CustomError = require('../../helpers/error/CustomError');
const Question = require('../../models/Question');
const Answer = require('../../models/Answer');

const checkUserExist = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const user = await User.findById(id);

  if (!user) return next(new CustomError('There is no user with that id', 400));

  req.data = user;

  return next();
});

const checkQuestionExist = asyncHandler(async (req, res, next) => {
  const id = req.params.id || req.params.question_id;

  const question = await Question.findById(id);

  if (!question) return next(new CustomError('There is no question with that id', 400));

  req.data = question;

  return next();
});

const checkQuestionAndAnswerExist = asyncHandler(async (req, res, next) => {
  const { question_id, answer_id } = req.params;

  const answer = await Answer.findOne({
    _id: answer_id,
    question: question_id,
  });

  if (!answer) return next(new CustomError('There is now answer with that answer id associated that question id.', 400));

  req.data = answer;

  return next();
});

module.exports = {
  checkUserExist,
  checkQuestionExist,
  checkQuestionAndAnswerExist,
};
