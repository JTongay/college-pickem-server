exports.up = knex => knex.schema.createTableIfNotExists('team_season', (table) => {
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


exports.down = knex => knex.schema.dropTableIfExists('team_season');
