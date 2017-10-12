
exports.up = knex => knex.createTableIfNotExists('matchups', (table) => {
    table.increments();
  });

exports.down = knex => knex.dropTableIfExists('matchups');
