/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const {faker} = require("@faker-js/faker");

const createFakeTasks = () => ({
  task: faker.lorem.sentence(3),
  description: faker.lorem.sentence(6),
  finished_at: faker.date.between('2023-04-29T00:00:00.000Z', '2023-06-01T00:00:00.000Z'),
  priority: faker.helpers.arrayElement(['Высокий', 'Средний', 'Низкий']),
  status: 'К выполнению',
  creator: 1,
  responsible: faker.helpers.arrayElement([1, 2]),
});

exports.seed = async function(knex, Promise) {
  const fakeTasks = [];
  for (let i = 0; i < 10; i++) {
    fakeTasks.push(createFakeTasks());
  }
  // Deletes ALL existing entries
  await knex('tasks').del()
  await knex('tasks').insert(fakeTasks);
};
