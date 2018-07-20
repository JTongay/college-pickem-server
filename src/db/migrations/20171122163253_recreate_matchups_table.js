exports.up = (knex, Promise) => {
  return knex.schema.createTableIfNotExists('matchups', (table) => {
    table.increments();
    table.integer('season_id')
      .unsigned()
      .index()
      .references('id')
      .inTable('seasons')
      .onDelete('CASCADE');
    table.integer('home_team_id')
      .unsigned()
      .index()
      .references('id')
      .inTable('teams')
      .onDelete('CASCADE');
    table.integer('away_team_id')
      .unsigned()
      .index()
      .references('id')
      .inTable('teams')
      .onDelete('CASCADE');
    table.integer('week');
    table.integer('match');
    table.string('location');
    table.timestamps(true, true);
  });
};

exports.down = knex => knex.schema.dropTableIfExists('matchups');
