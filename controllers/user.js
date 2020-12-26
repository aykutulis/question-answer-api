const asyncHandler = require('express-async-handler');

const getSingleUser = (req, res, next) => {
  return res.status(200).json({
    success: true,
    data: req.data,
  });
};

const getAllUsers = asyncHandler(async (req, res, next) => {
  return res.status(200).json(res.queryResults);
});

module.exports = {
  getSingleUser,
  getAllUsers,
};
