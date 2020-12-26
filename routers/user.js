const express = require('express');
const router = express.Router();
const { checkUserExist } = require('../middlewares/database/databaseErrorHandler');
const { getSingleUser, getAllUsers } = require('../controllers/user');
const userQuery = require('../middlewares/query/userQuery');
const User = require('../models/User');

// /api/users

router.get('/', userQuery(User), getAllUsers);
router.get('/:id', checkUserExist, getSingleUser);

module.exports = router;
