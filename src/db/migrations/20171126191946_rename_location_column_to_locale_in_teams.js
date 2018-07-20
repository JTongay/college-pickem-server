exports.up = knex => knex.schema.table('teams', (table) => {
  table.renameColumn('location', 'locale');
});

exports.down = knex => knex.schema.table('teams', (table) => {
  table.renameColumn('locale', 'location');
});
