const bcrypt = require('bcrypt');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('users').del()
  await knex('users').insert([
    {
      name: 'Данил',
      last_name: 'Щепелин',
      middle_name: 'Сергеевич',
      login: 'Danil',
      password: await bcrypt.hash('Danil', 6),
      leader: 1,
    },
    {
      name: 'Андрей',
      last_name: 'Андреевич',
      middle_name: 'Андреев',
      login: 'Andrew',
      password: await bcrypt.hash('Andrew', 6),
      leader: 1,
    },
  ]);
};
