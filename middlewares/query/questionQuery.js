const asyncHandler = require('express-async-handler');
const { searchHelper, populateHelper, paginationHelper, questionSortHelper } = require('../../helpers/query/queryHelpers');

const questionQuery = (model, options) => {
  return asyncHandler(async (req, res, next) => {
    // Initial Query
    let query = model.find();

    // Search
    query = searchHelper(query, req, 'title');

    // Population
    if (options && options.population) {
      query = populateHelper(query, options.population);
    }

    // Pagination
    const total = await model.countDocuments();
    const paginationResults = paginationHelper(query, req, total);
    const { pagination } = paginationResults;
    query = paginationResults.query;

    // Sort
    query = questionSortHelper(query, req);

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

module.exports = questionQuery;
