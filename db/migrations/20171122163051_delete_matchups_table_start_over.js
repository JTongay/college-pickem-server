exports.up = knex => knex.schema.dropTableIfExists('matchups');

exports.down = (knex, Promise) => {
  return knex.schema.createTableIfNotExists('matchups', (table) => {
    table.increments();
    table.string('week');
    table.string('matchup');
    table.timestamps(true, true);
  });
};
