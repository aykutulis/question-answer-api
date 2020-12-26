const asyncHandler = require('express-async-handler');
const CustomError = require('../helpers/error/CustomError');
const Answer = require('../models/Answer');

const getAllAnswerByQuestion = asyncHandler(async (req, res, next) => {
  const { question_id } = req.params;

  const answers = await Answer.find({ question: question_id });
  const count = answers.length;

  return res.status(200).json({
    success: true,
    count,
    data: answers,
  });
});

const getSingleAnswer = asyncHandler(async (req, res, next) => {
  const answer = req.data;

  await answer
    .populate({
      path: 'question',
      select: 'title',
    })
    .populate({
      path: 'user',
      select: 'name profile_image',
    })
    .execPopulate();

  return res.status(200).json({
    success: true,
    data: answer,
  });
});

const addNewAnswerToQuestion = asyncHandler(async (req, res, next) => {
  const { question_id } = req.params;
  const userId = req.user.id;

  const information = req.body;

  const answer = await Answer.create({
    ...information,
    user: userId,
    question: question_id,
  });

  return res.status(200).json({
    success: true,
    data: answer,
  });
});

const editAnswer = asyncHandler(async (req, res, next) => {
  const answer = req.data;
  const { content } = req.body;

  answer.content = content;

  await answer.save();

  return res.status(200).json({
    success: true,
    data: answer,
  });
});

const deleteAnswer = asyncHandler(async (req, res, next) => {
  const answerId = req.params.answer_id;

  const answer = await Answer.findById(answerId);

  await answer.remove();

  return res.status(200).json({
    success: true,
    message: 'Answer deleted successfully.',
  });
});

const likeAnswer = asyncHandler(async (req, res, next) => {
  const answer = req.data;
  const userId = req.user.id;

  if (answer.likes.includes(userId)) return next(new CustomError('You already liked this answer.', 400));

  answer.likes.push(userId);
  await answer.save();

  return res.status(200).json({
    success: true,
    data: answer,
  });
});

const undoLikeAnswer = asyncHandler(async (req, res, next) => {
  const answer = req.data;
  const userId = req.user.id;

  if (!answer.likes.includes(userId)) return next(new CustomError('You already did not like this answer.', 400));

  const index = answer.likes.indexOf(userId);

  answer.likes.splice(index, 1);

  await answer.save();

  return res.status(200).json({
    success: true,
    data: answer,
  });
});

module.exports = {
  addNewAnswerToQuestion,
  getAllAnswerByQuestion,
  getSingleAnswer,
  editAnswer,
  deleteAnswer,
  likeAnswer,
  undoLikeAnswer,
};
