export interface Team {
  id: number;
  team_name: string;
  abbr_name: string;
  locale: string;
  league: string;
  record: string;
  rank?: number;
  season_id: number;
}
