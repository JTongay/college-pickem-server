import { Score } from '@/models/Score';

export interface IScoreController {
  getFullWeeklyUserScore (userId: string, seasonId: string): Promise<Score[]>;
  getSingleUserScore (userId: string, seasonId: string, week: string): Promise<Score>;
  getTotalUserScore (userId: string, seasonId: string): Promise<any>;
  getLatestUserScore (userId: string, seasonId: string): Promise<Score>;
  getWeeklyScores (seasonId: string, week: string): Promise<Score[]>;
  getLeaderboard (seasonId: string, week: string): Promise<Score[]>;
}
