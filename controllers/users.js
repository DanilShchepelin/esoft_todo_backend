const knex = require('knex');
const config = require('../configs');
const session = require('express-session');

module.exports = {
    getResponsibles: async (req, res) => {
        const db = knex(config.development.database);
        const userId = req.session.user.id;

        const responsibles = await db
            .select({
                id: 'id',
                name: 'name',
                lastName: 'last_name',
                middleName: 'middle_name' 
            })
            .from('users')
            .where({'leader': userId});

        res.json({responsibles: responsibles});
    }
}