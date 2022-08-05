/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async (knex) => {
    await knex.schema.createTable('users', (table) => {
        table
            .increments('id')
            .primary()
            .comment('Идентификатор');
        table
            .string('name', 64)
            .notNullable()
            .comment('Имя');
        table
            .string('last_name', 64)
            .notNullable()
            .comment('Фамилия');
        table
            .string('middle_name', 64)
            .notNullable()
            .comment('Отчество');
        table
            .string('login', 64)
            .notNullable()
            .unique()
            .comment('Логин');
        table
            .string('password')
            .notNullable()
            .comment('Пароль');
        table
            .integer('leader')
            .notNullable()
            .references('id')
            .inTable('users')
            .comment('Руководитель');
        table.comment('Пользователи');
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async (knex) => {
    await knex.schema.dropTable('users');
};
