import { Connection } from '@/db/connection';
import { IMatchupController } from '@/controllers';
import { logger } from '@/services';
import { Matchup } from '@/models';
import { injectable } from 'inversify';
import 'reflect-metadata';

@injectable()
export class MatchupController extends Connection implements IMatchupController {

  constructor () {
    super();
  }

  /**
   *
   * @param {string} seasonId - the ID of the desired season
   * @returns {Promise<Matchup[]>}
   */
  public async getAllCurrentMatchups (seasonId: string): Promise<Matchup[]> {
    let response: Matchup[];
    try {
      response = await this.knex()
        .table('matchups')
        .where('season_id', seasonId)
        .join('seasons', 'matchups.season_id', 'seasons.id');
      return response;
    } catch (e) {
      logger.error(`Error retrieving matchups for season: ${seasonId} with error ${e}`);
      throw new Error(e);
    }
  }

  /**
   *
   * @param {string} seasonId - the ID of the desired season
   * @param {string} week - the desired week of a given season
   * @returns {Promise<Matchup[]>}
   */
  public async getMatchupsByWeek (seasonId: string, week: string): Promise<Matchup[]> {
    let response: Matchup[];
    try {
      response = await this.knex()
        .table('matchups')
        .where('season_id', seasonId)
        .andWhere('week', week)
        .orderBy('match', 'asc')
        .join('seasons', 'matchups.season_id', 'seasons.id');
      return response;
    } catch (e) {
      logger.error(`Error retrieving matchups for season: ${seasonId} and week ${week} with error ${e}`);
      throw new Error(e);
    }
  }

  /**
   *
   * @param {string} seasonId - the ID of a desired season
   * @param {string} teamId - the ID of a desired team
   * @param {string} type - away or home
   * @returns {Promise<any>}
   */
  public async getTeamMatchupData (seasonId: string, teamId: string, type: string): Promise<any> {
    let result: any;
    try {
      switch (type) {
        case 'home':
          result = await this.knex()
            .table('matchups')
            .where('season_id', seasonId)
            .join('teams', 'matchups.home_team_id', 'teams.id');
          break;
        case 'away':
          result = await this.knex()
            .table('matchups')
            .where('season_id', seasonId)
            .join('teams', 'matchups.away_team_id', 'teams.id');
          break;
        default:
          throw new Error(`${type} is not a valid type of team. Must be home or away`);
      }
      return result;
    } catch (e) {
      logger.error(`Unable to get teamMatchupData with id: ${teamId} with error: ${e}`);
      throw new Error(e);
    }
  }
}
