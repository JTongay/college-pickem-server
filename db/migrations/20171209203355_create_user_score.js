exports.up = knex => knex.schema.createTableIfNotExists('user_score', (table) => {
  table.increments();
  table.integer('season_id')
    .unsigned()
    .index()
    .references('id')
    .inTable('seasons')
    .onDelete('CASCADE');
  table.integer('user_id')
    .unsigned()
    .index()
    .references('id')
    .inTable('users')
    .onDelete('CASCADE');
  table.integer('points_total').defaultTo(0);
  table.integer('week');
  table.integer('points_week');
  table.timestamps(true, true);
});

exports.down = knex => knex.schema.dropTableIfExists('user_score');
