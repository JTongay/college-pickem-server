import { Score } from '@/models/Score';

export interface IScoreController {
  getFullWeeklyUserScore (userId: string, seasonId: string): Promise<Score[]>;
  getSingleUserScore (userId: string, seasonId: string, week: string): Promise<any>;
  getTotalUserScore (userId: string, seasonId: string): Promise<any>;
  getLatestUserScore (userId: string, seasonId: string): Promise<Score>;
}
