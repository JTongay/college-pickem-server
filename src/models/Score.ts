export interface Score {
  id: number;
  score: number;
  user_id: number;
  season_id: number;
  week: number;
  total_score: number;
  created_at: Date;
  updated_at: Date;
}
