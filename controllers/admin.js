const asyncHandler = require('express-async-handler');

const blockUser = asyncHandler(async (req, res, next) => {
  const user = req.data;

  user.blocked = !user.blocked;

  await user.save();

  return res.status(200).json({
    success: true,
    message: 'Blocked - Unblocked Succesfull.',
  });
});

const deleteUser = asyncHandler(async (req, res, next) => {
  const user = req.data;

  await user.remove();

  return res.status(200).json({
    success: true,
    message: 'Delete operation succesfull.',
  });
});

module.exports = {
  blockUser,
  deleteUser,
};
