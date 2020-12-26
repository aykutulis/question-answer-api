const searchHelper = (query, req, searchField) => {
  if (req.query.search) {
    const searchObject = {};

    const regex = new RegExp(req.query.search, 'i');
    searchObject[searchField] = regex;

    query = query.where(searchObject);

    return query;
  }

  return query;
};

const populateHelper = (query, population) => {
  return query.populate(population);
};

const paginationHelper = (query, req, total) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const pagination = {};

  if (startIndex > 0) {
    pagination.previous = {
      page: page - 1,
      limit: limit,
    };
  }

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit: limit,
    };
  }

  query = query === null ? null : query.skip(startIndex).limit(limit);

  return {
    query,
    pagination,
    startIndex,
    endIndex,
  };
};

const questionSortHelper = (query, req) => {
  const sortKey = req.query.sortBy;

  if (sortKey === 'most-answered') {
    return query.sort('-answerCount -createdAt');
  }
  if (sortKey === 'most-liked') {
    return query.sort('-likeCount -createdAt');
  }
  return query.sort('-createdAt');
};

module.exports = {
  searchHelper,
  populateHelper,
  paginationHelper,
  questionSortHelper,
};
