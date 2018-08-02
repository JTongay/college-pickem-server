exports.up = (knex, Promise) => {
  return knex.schema.createTableIfNotExists('seasons', (table) => {
    table.increments();
    table.string('league');
    table.date('start_date');
    table.date('end_date');
    table.boolean('active_season').defaultTo(true);
    table.timestamps(true, true);
  });
};

exports.down = knex => knex.schema.dropTableIfExists('seasons');
