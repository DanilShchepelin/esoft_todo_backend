const {Router} = require('express');
const authCheck = require('./../middlewares/authCheck')

const auth = require('./auth');
const tasks = require('./tasks');
const users = require('./users');

const router = Router();

router.use('/login', auth);
router.use('/tasks', authCheck, tasks);
router.use('/users', authCheck, users)


module.exports = router;

