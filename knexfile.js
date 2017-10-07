// Update with your config settings.

module.exports = {

  development: {
    client: 'pg',
    connection: {
      database: 'football_game_dev',
      host: 'localhost',
    },
    migrations: {
      directory: `${__dirname}/db/migrations`
    },
    seeds: {
      directory: `${__dirname}/db/seeds`
    }
  },

  test: {
    client: 'pg',
    connection: {
      database: 'football_game_test',
      host: 'localhost',
    },
    migrations: {
      directory: `${__dirname}/db/migrations`
    },
    seeds: {
      directory: `${__dirname}/db/seeds`
    }
  },

  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    migrations: {
      directory: `${__dirname}/db/migrations`
    },
    seeds: {
      directory: `${__dirname}/db/seeds`
    }
  }

};
