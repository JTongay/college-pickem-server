import { BaseRoute } from '@/routes/baseRoute';
import { logger } from '@/services';
import { NextFunction, Request, Router, Response } from 'express';
import { IScoreController, ISeasonController, IUserController } from '@/controllers';
import { container } from '@/inversify.config';
import { TYPES } from '@/types.classes';
import { ScoreResponse, ScoreResponseBuilder, SuccessResponse, SuccessResponseBuilder } from '@/builders/response';
import { Score } from '@/models/Score';

export class ScoresRoutes extends BaseRoute {
  private static instance: ScoresRoutes;
  private _scoreController: IScoreController;

  constructor (
    private ScoreController: IScoreController
  ) {
    super();
    this._scoreController = ScoreController;
    this.getFullWeeklyScoreByUserSeason = this.getFullWeeklyScoreByUserSeason.bind(this);
    this.getLatestScoreByUserSeason = this.getLatestScoreByUserSeason.bind(this);
    this.init();
  }

  static get router (): Router {
    if (!ScoresRoutes.instance) {
      ScoresRoutes.instance = new ScoresRoutes(
        container.get<IScoreController>(TYPES.IScoreController)
      );
    }
    return ScoresRoutes.instance.router;
  }

  private init (): void {
    logger.info('Creating ScoresRoutes');

    this.router.get('/user/:user_id', this.getFullWeeklyScoreByUserSeason);
    this.router.get('/user/:user_id/latest', this.getLatestScoreByUserSeason);
  }

  /**
   *
   * @param {e.Request} req
   * @param {e.Response} res
   * @param {e.NextFunction} next
   * @returns {Promise<void>}
   */
  private async getFullWeeklyScoreByUserSeason (req: Request, res: Response, next: NextFunction): Promise<void> {
    const userId: string = req.params.user_id;
    const seasonId: string = req.params.season_id;
    let result: Score[];
    let scoreResponse: ScoreResponse;
    const fullScoreResponse: ScoreResponse[] = [];
    let successResponse: SuccessResponse;
    try {
      // get the list of scores for a given user and season week by week
      result = await this._scoreController.getFullWeeklyUserScore(userId, seasonId);
      for (let i = 0; i < result.length; i++) {
        scoreResponse = new ScoreResponseBuilder(result[i].id)
          .setScore(result[i].score)
          .setTotalScore(result[i].total_score)
          .setSeasonId(result[i].season_id)
          .setWeek(result[i].week)
          .setUserId(result[i].user_id)
          .setCreatedAt(result[i].created_at)
          .setUpdatedAt(result[i].updated_at)
          .build();
        fullScoreResponse.push(scoreResponse);
      }
      successResponse = new SuccessResponseBuilder(200)
        .setData(fullScoreResponse)
        .setMessage('All scores for a given user and season')
        .build();
      res.status(200).json(successResponse);
    } catch (e) {
      next(e);
    }
  }

  /**
   *
   * @param {e.Request} req
   * @param {e.Response} res
   * @param {e.NextFunction} next
   * @returns {Promise<void>}
   */
  private async getLatestScoreByUserSeason (req: Request, res: Response, next: NextFunction): Promise<void> {
    const userId: string = req.params.user_id;
    const seasonId: string = req.params.season_id;
    let result: Score;
    let scoreResponse: ScoreResponse;
    let successResponse: SuccessResponse;
    try {
      result = await this._scoreController.getLatestUserScore(userId, seasonId);
      scoreResponse = new ScoreResponseBuilder(result.id)
        .setUserId(result.user_id)
        .setWeek(result.week)
        .setSeasonId(result.season_id)
        .setTotalScore(result.total_score)
        .setCreatedAt(result.created_at)
        .setUpdatedAt(result.updated_at)
        .build();
      successResponse = new SuccessResponseBuilder(200)
        .setData(scoreResponse)
        .setMessage('Got latest user score')
        .build();
      res.status(200).json(successResponse);
    } catch (e) {
      next(e);
    }
  }
}
