exports.up = knex => knex.createTableIfNotExists('seasons', (table) => {
  table.increments();
  table.string('league');
  table.date('start_date');
  table.date('end_date');
  table.boolean('active_season');
  table.timestamps(true, true);
});

exports.down = knex => knex.dropTableIfExists('seasons');
