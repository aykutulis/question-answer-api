const express = require('express');
const { getAccessToRoute, getAdminAccess } = require('../middlewares/authorization/auth');
const { checkUserExist } = require('../middlewares/database/databaseErrorHandler');
const { blockUser, deleteUser } = require('../controllers/admin');

const router = express.Router();

router.use([getAccessToRoute, getAdminAccess]);

router.get('/block/:id', checkUserExist, blockUser);
router.delete('/delete/:id', checkUserExist, deleteUser);

module.exports = router;
