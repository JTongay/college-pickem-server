exports.up = knex => knex.schema.createTableIfNotExists('user_pick', (table) => {
  table.increments();
  table.integer('user_id')
    .unsigned()
    .index()
    .references('id')
    .inTable('users')
    .onDelete('CASCADE');
  table.integer('matchup_id')
    .unsigned()
    .index()
    .references('id')
    .inTable('matchups')
    .onDelete('CASCADE');
  table.integer('team_id')
    .unsigned()
    .index()
    .references('id')
    .inTable('teams')
    .onDelete('CASCADE');
  table.boolean('winner').nullable().defaultTo(null);
  table.integer('points').nullable().defaultTo(null);
  table.timestamps(true, true);
});

exports.down = knex => knex.schema.dropTableIfExists('user_pick');
