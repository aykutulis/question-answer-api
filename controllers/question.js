const asyncHandler = require('express-async-handler');
const CustomError = require('../helpers/error/CustomError');
const Question = require('../models/Question');

const getAllQuestions = asyncHandler(async (req, res, next) => {
  return res.status(200).json(res.queryResults);
});

const getSingleQuestion = (req, res, next) => {
  res.status(200).json(res.queryResults);
};

const askNewQuestion = asyncHandler(async (req, res, next) => {
  const information = req.body;

  const question = await Question.create({
    ...information,
    user: req.user.id,
  });

  return res.status(200).json({
    success: true,
    data: question,
  });
});

const editQuestion = asyncHandler(async (req, res, next) => {
  let question = req.data;

  const { title, content } = req.body;

  if (title) question.title = title;
  if (content) question.content = content;

  question = await question.save();

  return res.status(200).json({
    success: true,
    data: question,
  });
});

const deleteQuestion = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  await Question.findByIdAndDelete(id);

  return res.status(200).json({
    success: true,
    message: 'Question delete operation succesfull.',
  });
});

const likeQuestion = asyncHandler(async (req, res, next) => {
  const question = req.data;
  const userId = req.user.id;

  if (question.likes.includes(userId)) return next(new CustomError('You already liked this question.', 400));

  question.likes.push(userId);
  question.likeCount = question.likes.length;
  await question.save();

  return res.status(200).json({
    success: true,
    data: question,
  });
});

const undoLikeQuestion = asyncHandler(async (req, res, next) => {
  const question = req.data;
  const userId = req.user.id;

  if (!question.likes.includes(userId)) return next(new CustomError('You already did not like this question.', 400));

  const index = question.likes.indexOf(userId);
  question.likes.splice(index, 1);
  question.likeCount = question.likes.length;

  await question.save();

  return res.status(200).json({
    success: true,
    data: question,
  });
});

module.exports = {
  askNewQuestion,
  getAllQuestions,
  getSingleQuestion,
  editQuestion,
  deleteQuestion,
  likeQuestion,
  undoLikeQuestion,
};
