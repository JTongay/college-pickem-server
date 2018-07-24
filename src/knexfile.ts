// Update with your config settings.
import { Config } from 'knex';

module.exports = {

  development: {
    client: 'pg',
    connection: {
      database: 'football_game_dev',
      host: 'localhost',
    },
    migrations: {
      directory: `${__dirname}/src/db/migrations`
    },
    seeds: {
      directory: `${__dirname}/src/db/seeds`
    }
  },

  test: {
    client: 'pg',
    connection: {
      database: 'football_game_test',
      host: 'localhost',
    },
    migrations: {
      directory: `${__dirname}/src/db/migrations`
    },
    seeds: {
      directory: `${__dirname}/src/db/seeds`
    }
  },

  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    migrations: {
      directory: `${__dirname}/src/db/migrations`
    },
    seeds: {
      directory: `${__dirname}/src/db/seeds`
    }
  }

};
