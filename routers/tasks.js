const {Router} = require('express');
const { getTasks, createTask, getTask, updateTask} = require('../controllers/tasks');

const router = Router();

router.get('/', getTasks);
router.post('/', createTask);
router.get('/:taskId', getTask);
router.put('/:taskId', updateTask);

module.exports = router;