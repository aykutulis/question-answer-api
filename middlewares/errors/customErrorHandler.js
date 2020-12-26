const CustomError = require('../../helpers/error/CustomError');

const customErrorHandler = (err, req, res, next) => {
  let customError = err;
  if (err.name === 'SyntaxError') {
    customError = new CustomError('Unexpected Syntax', 400);
  }

  if (err.name === 'ValidationError') {
    customError = new CustomError(err.message, 400);
  }

  if (err.code === 11000) {
    // Dublicate Key
    customError = new CustomError('Duplicated Key Found: Check Your Input', 400);
  }

  if (err.name === 'CastError') {
    customError = new CustomError('Invalid user id.', 400);
  }

  res.status(customError.status || 500).json({ success: false, message: customError.message });
};

module.exports = customErrorHandler;
