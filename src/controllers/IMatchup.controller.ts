import { Matchup } from '@/models';

export interface IMatchupController {
  getAllCurrentMatchups (seasonId: string): Promise<Matchup[]>;
  getMatchupsByWeek (seasonId: string, week: string): Promise<Matchup[]>;
  getTeamMatchupData (seasonId: string, teamId: string, type: string): Promise<any>;
}
