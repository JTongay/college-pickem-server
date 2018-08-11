import { Connection } from '@/db/connection';
import { ITeamController } from '@/controllers/ITeam.controller';
import { injectable } from 'inversify';
import 'reflect-metadata';
import { Team } from '@/models';

@injectable()
export class TeamController extends Connection implements ITeamController {

  constructor () {
    super();
  }

  /**
   *
   * @param {string} teamId - Id of a team
   * @param {string} seasonId - Id of the season
   * @returns {Promise<any>}
   *
   * College teams ranking changes every week,
   * and we want to archive past and current seasons' team data
   */
  public async getTeam (teamId: string, seasonId: string): Promise<any> {
    let response: Team;
    try {
      response = await this.knex()
        .table('team_season')
        .where('team_id', teamId)
        .andWhere('season_id', seasonId)
        .join('teams', 'team_season.team_id', '=', 'teams.id')
        .select(
          'teams.id',
          'teams.team_name',
          'teams.abbr_name',
          'teams.locale',
          'teams.league',
          'team_season.record',
          'team_season.rank',
          'team_season.season_id'
        );
      return response;
    } catch (e) {
      throw new Error(e);
    }
  }
}
