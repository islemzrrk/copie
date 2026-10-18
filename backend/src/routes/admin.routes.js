const router = require('express').Router();
const { verifyToken, requireRole } = require('../middlewares/auth');
const { listUsers, setStatut } = require('../controllers/admin.controller');

router.use(verifyToken, requireRole('admin'));

router.get('/users', listUsers);
router.patch('/users/:id/statut', setStatut);

module.exports = router;
