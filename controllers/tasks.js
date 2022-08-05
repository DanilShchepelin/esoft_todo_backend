const knex = require('knex');
const config = require('../configs');
const session = require('express-session');

module.exports = {
    getTasks: async (req, res) => {
        const db = knex(config.development.database);

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
                responsipbleLastName: 'users.last_name',
                responsibleMiddleName: 'users.middle_name'
            })
            .from({tasks: 'tasks'})
            .leftJoin({users: 'users'}, {'tasks.responsible': 'users.id'})
            .orderBy('updatedAt', 'desc');

        res.json({tasks: tasks});
    },
    createTask: async (req, res) => {
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
    },
    getTask: async(req, res) => {
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
                responsible: 'tasks.responsible',
                responsibleName: 'users.name',
                responsipbleLastName: 'users.last_name',
                responsibleMiddleName: 'users.middle_name',
            })
            .from({tasks: 'tasks'})
            .leftJoin({users: 'users'}, {'tasks.responsible': 'users.id'})
            .where({'tasks.id': taskId});

        res.json({task, task});
    },
    updateTask: async(req, res) => {
        const db = knex(config.development.database);
        const {taskId} = req.params;
        const {task, description, finishedAt, priority, status, responsible} = req.body;

        await db
            .update({
                task,
                description,
                'finished_at': finishedAt,
                priority,
                status,
                responsible
            })
            .from('tasks')
            .where({id: taskId});

        res.sendStatus(200);
    },
    updateTaskFromRes: async(req, res) => {
        const db = knex(config.development.database);
        const {taskId} = req.params;
        const {status} = req.body;

        await db
            .update({
                status,
                'updated_at': new Date().toISOString()
            })
            .from('tasks')
            .where({id: taskId});

        res.sendStatus(200);
    }
}