const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const { sendJwtToClient } = require('../helpers/authorization/tokenHelpers');
const { validateUserInput, comparePassword } = require('../helpers/input/inputHelpers');
const CustomError = require('../helpers/error/CustomError');
const sendEmail = require('../helpers/libraries/nodeMailer');

const register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    role,
  });
  sendJwtToClient(user, res);
});

const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!validateUserInput(email, password)) return next(new CustomError('Please check your inputs', 400));

  const user = await User.findOne({ email }).select('+password');

  if (!user) return next(new CustomError('User not found.'), 400);

  if (!comparePassword(password, user.password)) return next(new CustomError('Please check your credentials.', 400));

  sendJwtToClient(user, res);
});

const logout = asyncHandler(async (req, res, next) => {
  const { NODE_ENV } = process.env;

  res
    .status(200)
    .cookie({
      httpOnly: true,
      expires: new Date(Date.now()),
      secure: NODE_ENV === 'development' ? false : true,
    })
    .json({
      success: true,
      message: 'Logut Successfull',
    });
});

const getUser = (req, res, next) => {
  res.json({
    success: true,
    data: {
      id: req.user.id,
      name: req.user.name,
    },
  });
};

const forgotPassword = asyncHandler(async (req, res, next) => {
  const resetEmail = req.body.email;

  const user = await User.findOne({ email: resetEmail });

  if (!user) return next(new CustomError('There is no user with that email.', 400));

  const resetPasswordToken = user.getResetPasswordTokenFromUser();

  await user.save();

  const resetPasswordUrl = `http://localhost:5000/api/auth/resetpassword?resetPasswordToken=${resetPasswordToken}`;

  const emailTemplate = `
    <h2>Reset Your Password</h2>
    <p>This <a href='${resetPasswordUrl} target='_blank'>Link</a> will expire in 1 hour.</p>
  `;

  try {
    await sendEmail({
      from: process.env.SMTP_USER,
      to: resetEmail,
      subject: 'Reset Your Password',
      html: emailTemplate,
    });

    return res.status(200).json({
      success: true,
      message: 'Token sent to your email.',
    });
  } catch (err) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();
    return next(new CustomError('Email could not be sent.', 500));
  }
});

const resetPassword = asyncHandler(async (req, res, next) => {
  const { resetPasswordToken } = req.query;
  const { password } = req.body;

  if (!resetPasswordToken) return next(new CustomError('Please provide a valid token.', 400));

  let user = await User.findOne({
    resetPasswordToken: resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) return next(new CustomError('Invalid token or session expired.', 400));

  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  user.password = password;

  await user.save();

  return res.status(200).json({
    success: true,
    message: 'Reset password process succesfull.',
  });
});

const imageUpload = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.user.id, { profile_image: req.savedProfileImage }, { new: true, runValidators: true });

  res.status(200).json({
    success: true,
    message: 'Image upload succesfull',
    data: user,
  });
});

const editDetails = asyncHandler(async (req, res, next) => {
  const editInformation = req.body;
  const { id } = req.user;

  const user = await User.findByIdAndUpdate(id, editInformation, { new: true, runValidators: true });

  return res.status(200).json({
    success: true,
    data: user,
  });
});

module.exports = {
  register,
  login,
  logout,
  getUser,
  imageUpload,
  forgotPassword,
  resetPassword,
  editDetails,
};
