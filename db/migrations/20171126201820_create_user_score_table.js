exports.up = knex => knex.schema.createTableIfNotExists('user_score', (table) => {
  table.increments();
  table.integer('score').defaultTo(0);
  table.integer('user_id')
    .unsigned()
    .index()
    .references('id')
    .inTable('users')
    .onDelete('CASCADE');
  table.integer('season_id')
    .unsigned()
    .index()
    .references('id')
    .inTable('seasons')
    .onDelete('CASCADE');
  table.integer('week');
  table.integer('total_score');
  table.timestamps(true, true);
});


exports.down = (knex) => { knex.schema.dropTableIfExists('user_score'); };
