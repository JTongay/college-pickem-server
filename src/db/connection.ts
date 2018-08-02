import * as knex from 'knex';
import * as knexConfig from '../../knexfile';
import { Config } from 'knex';
import { injectable } from 'inversify';
import 'reflect-metadata';

@injectable()
export class Connection {
  public knex (): knex {
    return knex(exportConfig());
  }
}

function exportConfig (): Config {
  const env: string = process.env.NODE_ENV || 'development';
  return knexConfig[env];
}
