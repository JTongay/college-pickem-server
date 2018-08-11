import { Team } from '@/models';

export interface ITeamController {
  getTeam (teamId: string, seasonId: string): Promise<Team>;
}
