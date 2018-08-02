export interface IScoreController {
  getWeeklyUserScore (userId: string, seasonId: string): Promise<any>;
  getSingleUserScore (userId: string, seasonId: string, week: string): Promise<any>;
  getTotalUserScore (userId: string, seasonId: string): Promise<any>;
}
