import { ISeasonController } from '@/controllers/ISeason.controller';
import { Connection } from '@/db/connection';
import { Season, SeasonRequest } from '@/models';
import { logger } from '@/services';
import { injectable } from 'inversify';
import 'reflect-metadata';

@injectable()
export class SeasonController extends Connection implements ISeasonController {

  constructor () {
    super();
  }

  public async getAllSeasons (): Promise<Season[]> {
    let response: Season[];
    try {
      response = await this.knex().table('seasons');
      return response;
    } catch (e) {
      logger.error(`Error retrieving all seasons with error: ${e}`);
      throw new Error(e);
    }
  }

  public async getActiveSeason (league: string): Promise<Season> {
    let response: Season;
    try {
      response = await this.knex().table('seasons').where('league', league).andWhere('active_season', true).first();
      return response;
    } catch (e) {
      logger.error(`Error retrieving active season for ${league} with error: ${e}`);
      throw new Error(e);
    }
  }

  public async getSeasonById (id: string): Promise<Season> {
    let response: Season;
    try {
      response = await this.knex().table('seasons').where('id', id).first();
      return response;
    } catch (e) {
      logger.error(`Error retrieving season with id: ${id} with error: ${e}`);
      throw new Error(e);
    }
  }

  public async createNewSeason (season: SeasonRequest): Promise<Season> {
    let response: Season;
    try {
      response = await this.knex().table('seasons').insert(season).returning('*');
      return response;
    } catch (e) {
      logger.error(`Error inserting season ${season} with error: ${e}`);
      throw new Error(e);
    }
  }

  public async toggleSeason (id: string, active: boolean): Promise<void> {
    // const season: Season = await this.getSeasonById(id);
    try {
      await this.knex().table('seasons').where('id', id).first().update({active_season: active});
    } catch (e) {
      logger.error(`Cannot activate season with id: ${id} with error: ${e}`);
      throw new Error(e);
    }
  }

  public async deleteSeason (id: string): Promise<void> {
    try {
      await this.knex().table('seasons').where('id', id).del();
      logger.info(`Successfully deleted season with id: ${id}`);
    } catch (e) {
      logger.error(`Cannot delete season with ${id} with error: ${e}`);
      throw new Error(e);
    }
  }
}
