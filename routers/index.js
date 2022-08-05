const {Router} = require('express');

const auth = require('./auth');
const tasks = require('./tasks');
const users = require('./users');

const router = Router();

router.use('/login', auth);
router.use('/tasks', tasks);
router.use('/users', users)


module.exports = router;

