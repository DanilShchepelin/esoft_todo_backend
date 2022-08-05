/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async (knex) => {
    await knex.schema.createTable('tasks', (table) => {
        table
            .increments('id')
            .primary()
            .comment('Идентификатор');
        table
            .string('task', 64)
            .notNullable()
            .comment('Заголовок');
        table
            .string('description', 256)
            .notNullable()
            .comment('Описание');
        table
            .timestamp('finished_at', {useTz: false})
            .notNullable()
            .comment('Дата окончания');
        table
            .timestamp('created_at', {useTz: false})
            .notNullable()
            .defaultTo(knex.fn.now())
            .comment('Дата создания');
        table
            .timestamp('updated_at', {useTz: false})
            .nullable()
            .defaultTo(knex.fn.now())
            .comment('Дата обновления');
        table
            .string('priority', 12)
            .notNullable()
            .comment('Приоритет');
        table
            .string('status', 32)
            .notNullable()
            .defaultTo('К выполнению')
            .comment('Статус');
        table
            .integer('creator')
            .notNullable()
            .references('id')
            .inTable('users')
            .comment('Создатель');
        table
            .integer('responsible')
            .notNullable()
            .references('id')
            .inTable('users')
            .comment('Ответственный');
        table.comment('Задачи')
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async (knex) => {
    await knex.schema.dropTable('tasks');
};
