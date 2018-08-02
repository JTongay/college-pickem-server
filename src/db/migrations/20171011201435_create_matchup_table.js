exports.up = (knex, Promise) => {
  return knex.schema.createTableIfNotExists('matchups', (table) => {
    table.increments();
    table.string('week');
    table.string('matchup');
    table.timestamps(true, true);
  });
};

exports.down = knex => knex.schema.dropTableIfExists('matchups');
