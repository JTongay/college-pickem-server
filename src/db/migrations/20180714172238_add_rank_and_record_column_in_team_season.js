exports.up = knex => knex.schema.table('team_season', (table) => {
  table.integer('rank').nullable().defaultTo(null);
});

exports.down = knex => knex.schema.table('team_season', (table) => {
  table.dropColumn('rank');
});
