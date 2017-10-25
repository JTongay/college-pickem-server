exports.up = knex => knex.schema.createTableIfNotExists('teams', (table) => {
  table.increments();
  table.string('team_name');
  table.string('abbr_name');
  table.string('location');
  table.string('league');
  table.string('record');
  table.integer('rank').nullable().defaultTo(null);
  table.timestamps(true, true);
});

exports.down = knex => knex.dropTableIfExists('teams');
