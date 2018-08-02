exports.up = knex => knex.schema.table('matchups', (table) => {
  table.string('score').nullable().defaultTo(null);
  table.integer('winner')
    .unsigned()
    .index()
    .nullable()
    .defaultTo(null)
    .references('id')
    .inTable('teams')
    .onDelete('CASCADE');
});

exports.down = knex => knex.schema.table('matchups', (table) => {
  table.dropColumn('score');
  table.dropColumn('winner');
});
