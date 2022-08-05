const {Router} = require('express');
const { getTasks, createTask, getTask, updateTaskFromRes } = require('../controllers/tasks');

const router = Router();

router.get('/', getTasks);
router.post('/', createTask);
router.get('/:taskId', getTask);
router.put('/:taskId', updateTaskFromRes);

module.exports = router;