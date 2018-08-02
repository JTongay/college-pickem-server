import { Connection } from '@/db/connection';
import { IScoreController, IUserController, UserController } from '@/controllers';
import { injectable } from 'inversify';
import 'reflect-metadata';
import { User } from '@/models';
import {logger} from '@/services';

@injectable()
export class ScoreController extends Connection implements IScoreController {
  private _userController: IUserController;

  constructor (private UserController: UserController) {
    super();
    this._userController = UserController;
  }

  public async getWeeklyUserScore (userId: string, seasonId: string): Promise<any> {
    let score: any;
    try {
      score = await this.knex().table('user_score').where('user_id', userId).andWhere('season_id', seasonId);
      logger.info(`Grabbing FullUserScore with user_id ${userId}, and season_id ${seasonId}`);
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
}
