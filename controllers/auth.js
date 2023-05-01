const knex = require('knex');
const config = require('../configs');
const session = require('express-session');
const bcript = require('bcrypt');

module.exports = {
    getUser: async (req, res) => {
        try {
            const {login, password} = req.body;
            const db = knex(config.development.database);

            if (login === '' || password === '') {
                res.json({message: 'Поля должны быть заполнены'})
                return;
            }

            const user = await db
                .first({
                    id: 'id',
                    name: 'name',
                    lastName: 'last_name',
                    middleName: 'middle_name',
                    login: 'login',
                    password: 'password'
                })
                .from('users')
                .where({login: login})
                .orWhere({password: password});

            const userPassword = bcript.compareSync(password, user.password);
            if (userPassword) {
                req.session.user = {
                    id: user.id,
                    name: user.name,
                    lastName: user.lastName,
                    middleName: user.middleName,
                    login: user.login
                };
            } else {
                res.json({message: 'Неверный логин или пароль'});
                return console.log('incorrect password');
            }

            if (req.sessionID && req.session.user) {
                res.status(200);
                const sessionID = req.sessionID;
                const loginUser = req.session.user.id;
                return res.json({sessionID, loginUser});
            }
            return res.sendStatus(200);
        } catch (e) {
            res.json({message: 'Такого пользователя не существует'});
        }
    },
    logoutUser: async (req, res) => {
        try {
            await req.session.destroy();
            console.log('logout');
            return res.sendStatus(200);
        } catch (e) {
            res.status(500).json({message: 'Ошибка выполнения запроса'});
        }
    },
}