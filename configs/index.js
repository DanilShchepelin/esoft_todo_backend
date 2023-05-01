module.exports = {
    development: {
        database: {
            client: 'postgresql',
            connection: {
                database: 'postgres',
                user: 'postgres',
                password: 'postgres'
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