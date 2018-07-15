exports.up = knex => knex.schema.table('teams', (table) => {
  table.dropColumn('record');
  table.dropColumn('rank');
});

exports.down = knex => knex.schema.table('teams', (table) => {
  table.string('record');
  table.integer('rank').nullable().defaultTo(null);
});
