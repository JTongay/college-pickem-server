exports.up = knex => knex.createTableIfNotExists('teams_season', (table) => {
  table.increments();
  table.integer('team_id')
    .unsigned()
    .index()
    .references('id')
    .inTable('teams')
    .onDelete('CASCADE');
  table.integer('season_id')
    .unsigned()
    .index()
    .references('id')
    .inTable('seasons')
    .onDelete('CASCADE');
  table.string('record')
    .defaultTo('0-0');
  table.timestamps(true, true);
});


exports.down = knex => knex.dropTableIfExists('teams_season');
