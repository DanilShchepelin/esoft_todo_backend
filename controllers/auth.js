const knex = require('knex');
const config = require('../configs');
const session = require('express-session');
const bcript = require('bcrypt');

module.exports = {
    getUser: async (req, res) => {
        const {login, password} = req.body;
        const db = knex(config.development.database);

        if (login == '' || password == '') {
            res.sendStatus(303);
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
        }
        else {
            res.sendStatus(301);
            return console.log('incorrect password');
        }

        // if (user.login !== login) {
        //     res.status(301);
        // }

        if (req.sessionID && req.session.user) {
            res.status(200);
            const sessionID = req.sessionID;
            const login = req.login;
            return res.json({sessionID, sessionID, login});
        }
        return res.sendStatus(304);
    },
    logoutUser: async (req, res) => {
        await req.session.destroy();
        console.log('logout');
        return res.sendStatus(200);
    },
}