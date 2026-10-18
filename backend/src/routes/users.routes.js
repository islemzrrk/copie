const router = require('express').Router();
const { verifyToken } = require('../middlewares/auth');
const { getMe, updateMe } = require('../controllers/users.controller');

router.get('/me', verifyToken, getMe);
router.put('/me', verifyToken, updateMe);

module.exports = router;
