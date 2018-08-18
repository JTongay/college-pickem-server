import { Connection } from '@/db/connection';
import { IScoreController, IUserController, UserController } from '@/controllers';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { User } from '@/models';
import { IAuthService, logger } from '@/services';
import { TYPES } from '@/types.classes';
import { Score } from '@/models/Score';

@injectable()
export class ScoreController extends Connection implements IScoreController {
  private _userController: IUserController;

  constructor (
    @inject(TYPES.IUserController) UserController: IUserController
  ) {
    super();
    this._userController = UserController;
  }

  public async getFullWeeklyUserScore (userId: string, seasonId: string): Promise<Score[]> {
    let score: Score[];
    try {
      score = await this.knex()
        .table('user_score')
        .where('user_id', userId)
        .andWhere('season_id', seasonId)
        .orderBy('week', 'asc');
      logger.info(`Grabbing WeeklyUserScore with user_id ${userId}, and season_id ${seasonId}`);
      return score;
    } catch (e) {
      logger.error(`Cannot retrieve WeeklyUserScore with error ${e}`);
      throw new Error(e);
    }
  }

  public async getSingleUserScore (userId: string, seasonId: string, week: string): Promise<any> {
    let score: any;
    try {
      score = await this.knex().table('user_score')
        .where('user_id', userId)
        .andWhere('season_id', seasonId)
        .andWhere('week', week)
        .first();
      return score;
    } catch (e) {
      logger.error(`Cannot retrieve SingleUserScore with error ${e}`);
      throw new Error(e);
    }
  }

  public async getTotalUserScore (userId: string, seasonId: string): Promise<any> {
    let score: any;
    try {
      score = await true;
      return score;
    } catch (e) {
      throw new Error(e);
    }
  }

  public async getLatestUserScore (userId: string, seasonId: string): Promise<Score> {
    let score: Score;
    try {
      score = await this.knex()
        .table('user_score')
        .where('season_id', seasonId)
        .andWhere('user_id', userId)
        .orderBy('week', 'desc')
        .limit(1)
        .first();
      return score;
    } catch (e) {
      logger.error(`Cannot retrieve latest User score with ${e}`);
      throw new Error(e);
    }
  }
}
