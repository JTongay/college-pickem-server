// Update with your config settings.

module.exports = {

  development: {
    client: 'pg',
    connection: {
      database: 'football-pickem-dev',
      host: 'localhost',
      migrations: {
        directory: `${__dirname}/db/migrations`
      },
      seeds: {
        directory: `${__dirname}/db/seeds`
      }
    }
  },

  test: {
    client: 'pg',
    connection: {
      database: 'football-pickem-test',
      host: 'localhost'
    }
  },

  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL
  }

};
