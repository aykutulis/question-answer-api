const CustomError = require('../../helpers/error/CustomError');
const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const { isTokenIncluded, getAccessTokenFromHeader } = require('../../helpers/authorization/tokenHelpers');
const asyncHandler = require('express-async-handler');
const Question = require('../../models/Question');
const Answer = require('../../models/Answer');

const getAccessToRoute = (req, res, next) => {
  const { JWT_SECRET_KEY } = process.env;

  if (!isTokenIncluded(req)) return next(new CustomError('You are not authorized to access this route.'), 401);

  const accessToken = getAccessTokenFromHeader(req);

  jwt.verify(accessToken, JWT_SECRET_KEY, (err, decoded) => {
    if (err) return next(new CustomError('You are not authorized to access this route.'), 401);

    req.user = {
      id: decoded.id,
      name: decoded.name,
    };
    next();
  });
};

const getAdminAccess = asyncHandler(async (req, res, next) => {
  const { id } = req.user;

  const user = await User.findById(id);

  if (user.role !== 'admin') return next(new CustomError('Only admins can access this route.', 403));

  return next();
});

const getQuestionOwnerAccess = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const questionId = req.params.id;

  const question = await Question.findById(questionId);

  if (userId != question.user) return next(new CustomError('Only owner can handle this operation', 403));

  return next();
});

const getAnswerOwnerAccess = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const answerId = req.params.answer_id;

  const answer = await Answer.findById(answerId);

  if (userId != answer.user) return next(new CustomError('Only owner can handle this operation', 400));

  return next();
});

module.exports = {
  getAccessToRoute,
  getAdminAccess,
  getQuestionOwnerAccess,
  getAnswerOwnerAccess,
};
