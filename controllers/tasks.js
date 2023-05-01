const knex = require('knex');
const config = require('../configs');
const session = require('express-session');

module.exports = {
    getTasks: async (req, res) => {
        try {
            const db = knex(config.development.database);
            const {responsible, finishDate} = req.query;
            const authorizeUserId = req.session.user.id;

            let date = new Date();
            let today = date.setDate(date.getDate());
            let tomorrow = date.setDate(date.getDate() + 1);
            let week = date.setDate(date.getDate() + 7);

            function formatDate(date) {
                let newDate = new Date(date);
                newDate.setHours(0, 0);
                newDate.setMinutes(0, 0);
                newDate.setSeconds(0, 0);
                return newDate.toISOString();
            }

            const tasks = await db
                .select({
                    id: 'tasks.id',
                    task: 'tasks.task',
                    description: 'tasks.description',
                    finishedAt: 'tasks.finished_at',
                    updatedAt: 'tasks.updated_at',
                    priority: 'tasks.priority',
                    status: 'tasks.status',
                    creator: 'tasks.creator',
                    responsible: 'tasks.responsible',
                    responsibleName: 'users.name',
                    responsibleLastName: 'users.last_name',
                    responsibleMiddleName: 'users.middle_name'
                })
                .from('tasks')
                .leftJoin({users: 'users'}, {'tasks.responsible': 'users.id'})
                .where((qb) => {
                    if (responsible) {
                        qb.where({'tasks.responsible': responsible})
                    } else {
                        qb.where({'tasks.responsible': authorizeUserId})
                    }
                    if (finishDate === 'today') {
                        qb.whereBetween('finished_at', [formatDate(today), formatDate(tomorrow)])
                    } else if (finishDate === 'week') {
                        qb.whereBetween('finished_at', [formatDate(today), formatDate(week)])
                    } else if (finishDate === 'moreThanWeek') {
                        qb.where('finished_at', '>', formatDate(week));
                    }
                })
                .orderBy('updatedAt', 'desc');
            if (!tasks) {
                return res.status(400).json({message: 'Задачи не найдены'});
            }
            return res.json({tasks});
        } catch (e) {
            res.status(500).json({message: 'Ошибка выполнения запроса'});
        }
    },
    createTask: async (req, res) => {
        try {
            const db = knex(config.development.database);
            const {task, description, finishedAt, priority, responsible} = req.body;
            const creatorId = req.session.user.id;

            await db
                .insert({
                    task,
                    description,
                    priority,
                    responsible,
                    creator: creatorId,
                    finished_at: finishedAt
                })
                .into('tasks');
            res.sendStatus(200);
        } catch (e) {
            res.status(500).json({message: 'Ошибка выполнения запроса'});
        }
    },
    getTask: async(req, res) => {
        try {
            const db = knex(config.development.database);
            const {taskId} = req.params;

            const task = await db
                .first({
                    id: 'tasks.id',
                    task: 'tasks.task',
                    description: 'tasks.description',
                    finishedAt: 'tasks.finished_at',
                    updatedAt: 'tasks.updated_at',
                    priority: 'tasks.priority',
                    status: 'tasks.status',
                    creator: 'tasks.creator',
                    creatorName: 'userCreator.name',
                    creatorLastName: 'userCreator.last_name',
                    creatorMiddleName: 'userCreator.middle_name',
                    responsible: 'tasks.responsible',
                    responsibleName: 'userResponsible.name',
                    responsibleLastName: 'userResponsible.last_name',
                    responsibleMiddleName: 'userResponsible.middle_name',
                })
                .from({tasks: 'tasks'})
                .join('users as userResponsible', 'tasks.responsible', 'userResponsible.id')
                .leftJoin('users as userCreator', 'tasks.creator', 'userCreator.id')
                .where({'tasks.id': taskId});
            if (!task) {
                return res.status(400).json({message: 'Задача не найдены'});
            }
            res.json({task});
        } catch (e) {
            res.status(500).json({message: 'Ошибка выполнения запроса'});
        }
    },
    updateTask: async(req, res) => {
        try {
            const db = knex(config.development.database);
            const {taskId} = req.params;
            const {task, description, finishedAt, priority, status, responsible} = req.body;
            const userId = req.session.user.id;

            const taskForUpdate = await db
                .first({
                    id: 'id',
                    creator: 'creator',
                    responsible: 'responsible'
                })
                .from('tasks')
                .where({id: taskId})

            if (taskForUpdate.creator !== userId ) {
                await db
                    .update({
                        status,
                        'updated_at': new Date().toISOString()
                    })
                    .from('tasks')
                    .where({id: taskId});
            } else {
                await db
                    .update({
                        task,
                        description,
                        'finished_at': finishedAt,
                        priority,
                        status,
                        responsible,
                        'updated_at': new Date().toISOString()
                    })
                    .from('tasks')
                    .where({id: taskId});
                res.sendStatus(200);
            }
        } catch (e) {
            res.status(500).json({message: 'Ошибка выполнения запроса'});
        }
    }
}