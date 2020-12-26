const asyncHandler = require('express-async-handler');
const { paginationHelper } = require('../../helpers/query/queryHelpers');

const answerQuery = (options) => {
  return asyncHandler(async (req, res, next) => {
    const total = req.data.answerCount;

    const { startIndex, endIndex, pagination } = paginationHelper(null, req, total);

    req.data = await req.data.populate(options).execPopulate();
    req.data.answers = req.data.answers.slice(startIndex, endIndex);

    let query = req.data;

    res.queryResults = {
      success: true,
      pagination,
      data: query,
    };

    return next();
  });
};

module.exports = answerQuery;
