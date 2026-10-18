const router = require('express').Router();
const { getReference } = require('../controllers/reference.controller');

router.get('/', getReference);

module.exports = router;
