module.exports = {
    development: {
        database: {
            client: 'postgresql',
            connection: {
                database: 'esoft_todo',
                user: 'esoft_project',
                password: 'esoft'
            },
            migrations: {
                tableName: 'knex_migrations',
                directory: './db/migrations'
            },
            seeds: {
                directory: './db/seeds'
            }
        }
    }
}