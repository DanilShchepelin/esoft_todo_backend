const {Router} = require('express');
const { getResponsibles } = require('../controllers/users');

const router = Router();

router.get('/', getResponsibles);

module.exports = router;