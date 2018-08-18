import { User } from '@/models/User';

export interface Leaderboard {
  id: number;
  user: User;
  score: number;
  season_id: number;
  week: number;
  total_score: number;
  created_at: Date;
  updated_at: Date;
}
