const asyncHandler = require('express-async-handler');
const { searchHelper, paginationHelper } = require('../../helpers/query/queryHelpers');

const userQuery = (model) => {
  return asyncHandler(async (req, res, next) => {
    // Inital Query
    let query = model.find();

    // Search
    query = searchHelper(query, req, 'name');

    //Pagination
    const total = await model.countDocuments();
    const paginationResults = paginationHelper(query, req, total);
    const { pagination } = paginationResults;
    query = paginationResults.query;

    const queryResults = await query;

    res.queryResults = {
      success: true,
      count: queryResults.length,
      total,
      pagination,
      data: queryResults,
    };

    return next();
  });
};

module.exports = userQuery;
