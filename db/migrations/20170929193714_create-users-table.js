
exports.up = (knex, Promise) => {
  return knex.schema.createTableIfNotExists('users', (table) => {
    table.increments();
    table.string('first_name');
    table.string('last_name');
    table.string('username');
    table.string('email');
    table.string('password');
    table.timestamps(true, true);
  });
};

exports.down = (knex, Promise) => knex.schema.dropTableIfExists('users');
