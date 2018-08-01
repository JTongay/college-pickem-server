import { ISeasonController } from '@/controllers/ISeason.controller';
import { Connection } from '@/db/connection';
import { Season } from '@/models';
import { logger } from '@/services';

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
      logger.info(`Error retrieving all seasons with error: ${e}`);
      throw new Error(e);
    }
  }
}
