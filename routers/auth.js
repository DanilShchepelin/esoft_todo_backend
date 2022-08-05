const {Router} = require('express');
const { getUser, logoutUser } = require('../controllers/auth');

const router = Router();

router.post('/auth', getUser);
router.post('/logout', logoutUser);

module.exports = router;