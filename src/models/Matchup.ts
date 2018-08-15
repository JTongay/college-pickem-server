export interface Matchup {
  id: number;
  season_id: number;
  home_team_id: number;
  away_team_id: number;
  week: number;
  match: number;
  location: string;
  league: string;
  created_at: Date;
  updated_at: Date;
}
