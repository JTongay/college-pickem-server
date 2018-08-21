import { BaseRoute } from '@/routes/baseRoute';
import { logger } from '@/services';
import { NextFunction, Request, Router, Response } from 'express';
import { IScoreController, ISeasonController, IUserController } from '@/controllers';
import { container } from '@/inversify.config';
import { TYPES } from '@/types.classes';
import {
  ScoreResponse, ScoreResponseBuilder, SuccessResponse, SuccessResponseBuilder,
  UserResponseBuilder
} from '@/builders/response';
import { Score } from '@/models/Score';
import { User } from '@/models';

export class ScoresRoutes extends BaseRoute {
  private static instance: ScoresRoutes;
  private _scoreController: IScoreController;
  private _userController: IUserController;

  constructor (
    private ScoreController: IScoreController,
    private UserController: IUserController
  ) {
    super();
    this._scoreController = ScoreController;
    this._userController = UserController;
    // need to bind the context of this to the class
    this.getFullWeeklyScoreByUserSeason = this.getFullWeeklyScoreByUserSeason.bind(this);
    this.getLatestScoreByUserSeason = this.getLatestScoreByUserSeason.bind(this);
    this.getUserScoreByWeek = this.getUserScoreByWeek.bind(this);
    this.getAllScoresByWeek = this.getAllScoresByWeek.bind(this);
    this.getLeaderboard = this.getLeaderboard.bind(this);
    this.init();
  }

  static get router (): Router {
    if (!ScoresRoutes.instance) {
      ScoresRoutes.instance = new ScoresRoutes(
        container.get<IScoreController>(TYPES.IScoreController),
        container.get<IUserController>(TYPES.IUserController)
      );
    }
    return ScoresRoutes.instance.router;
  }

  private init (): void {
    logger.info('Creating ScoresRoutes');

    this.router.get('/user/:user_id', this.getFullWeeklyScoreByUserSeason);
    this.router.get('/user/:user_id/latest', this.getLatestScoreByUserSeason);
    this.router.get('/:week/user/:user_id', this.getUserScoreByWeek);
    this.router.get('/:week', this.getAllScoresByWeek);
    this.router.get('/:week/leaderboard', this.getLeaderboard);
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
      // loop through the list and create a new ScoreResponse Object
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
        // Push each new object into the full score response Array
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

  public async getUserScoreByWeek (req: Request, res: Response, next: NextFunction): Promise<void> {
    const userId: string = req.params.user_id;
    const seasonId: string = req.params.season_id;
    const week: string = req.params.week;
    let result: Score;
    let scoreResponse: ScoreResponse;
    let successResponse: SuccessResponse;
    try {
      result = await this._scoreController.getSingleUserScore(userId, seasonId, week);
      scoreResponse = new ScoreResponseBuilder(result.id)
        .setUserId(result.user_id)
        .setWeek(result.week)
        .setSeasonId(result.season_id)
        .setScore(result.score)
        .setTotalScore(result.total_score)
        .setCreatedAt(result.created_at)
        .setUpdatedAt(result.updated_at)
        .build();
      successResponse = new SuccessResponseBuilder(200)
        .setData(scoreResponse)
        .setMessage('Got Score by week')
        .build();
      res.status(200).json(successResponse);
    } catch (e) {
      next(e);
    }
  }

  public async getAllScoresByWeek (req: Request, res: Response, next: NextFunction): Promise<void> {
    const seasonId: string = req.params.season_id;
    const week: string = req.params.week;
    let result: Score[];
    let scoreResponse: ScoreResponse;
    const fullScoreResponse: ScoreResponse[] = [];
    let successResponse: SuccessResponse;
    try {
      result = await this._scoreController.getWeeklyScores(seasonId, week);
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
        // Push each new object into the full score response Array
        fullScoreResponse.push(scoreResponse);
      }
      successResponse = new SuccessResponseBuilder(200)
        .setData(fullScoreResponse)
        .setMessage('All scores for a given week')
        .build();
      res.status(200).json(successResponse);
    } catch (e) {
      next(e);
    }
  }

  public async getLeaderboard (req: Request, res: Response, next: NextFunction): Promise<void> {
    const seasonId: string = req.params.season_id;
    const week: string = req.params.week;
    let result: Score[];
    let user: User;
    let scoreResponse: ScoreResponse;
    const fullScoreResponse: ScoreResponse[] = [];
    let successResponse: SuccessResponse;
    try {
      result = await this._scoreController.getLeaderboard(seasonId, week);
      for (let i = 0; i < result.length; i++) {
        user = await this._userController.getUserById(result[i].user_id.toString());
        scoreResponse = new ScoreResponseBuilder(result[i].id)
          .setScore(result[i].score)
          .setTotalScore(result[i].total_score)
          .setSeasonId(result[i].season_id)
          .setWeek(result[i].week)
          .setUser(user)
          .setCreatedAt(result[i].created_at)
          .setUpdatedAt(result[i].updated_at)
          .build();
        // Push each new object into the full score response Array
        fullScoreResponse.push(scoreResponse);
      }
      successResponse = new SuccessResponseBuilder(200)
        .setData(fullScoreResponse)
        .setMessage('All scores for a given week')
        .build();
      res.status(200).json(successResponse);
    } catch (e) {
      next(e);
    }
  }

}
