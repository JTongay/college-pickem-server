import { BaseRoute } from '@/routes/baseRoute';
import { Request, Router, Response, NextFunction } from 'express';
import { logger } from '@/services';
import { ISeasonController } from '@/controllers';
import { container } from '@/inversify.config';
import { TYPES } from '@/types.classes';
import { Season, SeasonRequest } from '@/models';
import { interfaces } from 'inversify';
import { ErrorResponse,
  ErrorResponseBuilder,
  SuccessResponse,
  SuccessResponseBuilder,
  SeasonResponse,
  SeasonResponseBuilder
} from '@/builders/response';
import { ErrorCodes } from '@/utils';

export class SeasonsRoutes extends BaseRoute {
  private static instance: SeasonsRoutes;
  private _seasonController: ISeasonController;

  constructor (
    private SeasonController: ISeasonController
  ) {
    super();
    this._seasonController = SeasonController;
    this.getSeason = this.getSeason.bind(this);
    this.activateSeason = this.activateSeason.bind(this);
    this.deactivateSeason = this.deactivateSeason.bind(this);
    this.createSeason = this.createSeason.bind(this);
    this.deleteSeason = this.deleteSeason.bind(this);
    this.init();
  }

  private init (): void {
    logger.info('Creating SeasonsRoutes');

    this.router.get('/:id', this.getSeason);
    this.router.put('/:id/activate', this.activateSeason);
    this.router.put('/:id/deactivate', this.deactivateSeason);
    this.router.delete('/:id', this.deleteSeason);
    this.router.post('/', this.createSeason);
  }

  static get router (): Router {
    // logger.info('creating SeasonsRoutes');
    if (!SeasonsRoutes.instance) {
      SeasonsRoutes.instance = new SeasonsRoutes(
        container.get<ISeasonController>(TYPES.ISeasonController)
      );
    }
    return SeasonsRoutes.instance.router;
  }

  private async getSeason (req: Request, res: Response, next: NextFunction): Promise<void> {
    const seasonId: string = req.params.id;
    let season: Season;
    let seasonResponse: SeasonResponse;
    let successResponse: SuccessResponse;
    let errorResponse: ErrorResponse;
    try {
      season = await this._seasonController.getSeasonById(seasonId);
      if (!season) {
        errorResponse = new ErrorResponseBuilder(404)
          .setErrorCode(ErrorCodes.seasonNotFound)
          .build();
        res.status(404).json(errorResponse);
      }
      seasonResponse = new SeasonResponseBuilder(season.id)
        .setStartDate(season.start_date)
        .setEndDate(season.end_date)
        .setActiveSeason(season.active_season)
        .setLeague(season.league)
        .build();
      successResponse = new SuccessResponseBuilder(200)
        .setData(seasonResponse)
        .setMessage(`Successfully retrieved season with id: ${seasonId}`)
        .build();
      res.status(200).json(successResponse);
    } catch (e) {
      logger.error(`error accessing route season/:id with error: ${e}`);
      next(e);
    }
  }

  private async activateSeason (req: Request, res: Response, next: NextFunction): Promise<void> {
    const seasonId: string = req.params.id;
    let season: Season = await this._seasonController.getSeasonById(seasonId);
    let seasonResponse: SeasonResponse;
    let successResponse: SuccessResponse;
    let errorResponse: ErrorResponse;
    if (!season) {
      errorResponse = new ErrorResponseBuilder(404)
        .setErrorCode(ErrorCodes.seasonNotFound)
        .build();
      res.status(404).json(errorResponse);
    }
    try {
      await this._seasonController.toggleSeason(seasonId, true);
      season = await this._seasonController.getSeasonById(seasonId);
      seasonResponse = new SeasonResponseBuilder(season.id)
        .setActiveSeason(season.active_season)
        .setLeague(season.league)
        .build();
      successResponse = new SuccessResponseBuilder(200)
        .setData(seasonResponse)
        .setMessage('Season activated')
        .build();
      res.status(200).json(successResponse);
    } catch (e) {
      logger.error(`Cannot activate PUT /${seasonId}/activate with error ${e}`);
      next(e);
    }
  }

  private async deactivateSeason (req: Request, res: Response, next: NextFunction): Promise<void> {
    const seasonId: string = req.params.id;
    let season: Season = await this._seasonController.getSeasonById(seasonId);
    let seasonResponse: SeasonResponse;
    let successResponse: SuccessResponse;
    let errorResponse: ErrorResponse;
    if (!season) {
      errorResponse = new ErrorResponseBuilder(404)
        .setErrorCode(ErrorCodes.seasonNotFound)
        .build();
      res.status(404).json(errorResponse);
    }
    try {
      await this._seasonController.toggleSeason(seasonId, false);
      season = await this._seasonController.getSeasonById(seasonId);
      seasonResponse = new SeasonResponseBuilder(season.id)
        .setActiveSeason(season.active_season)
        .setLeague(season.league)
        .build();
      successResponse = new SuccessResponseBuilder(200)
        .setData(seasonResponse)
        .setMessage('Season deactivated')
        .build();
      res.status(200).json(successResponse);
    } catch (e) {
      logger.error(`Cannot deactivate PUT season/${seasonId}/deactivate with error ${e}`);
      next(e);
    }
  }

  private async createSeason (req: Request, res: Response, next: NextFunction): Promise<void> {
    const seasonRequest: SeasonRequest = new SeasonRequest(req.body);
    let createdSeason: Season;
    let seasonResponse: SeasonResponse;
    let successResponse: SuccessResponse;
    // const errorResponse: ErrorResponse;
    try {
      createdSeason = await this._seasonController.createNewSeason(seasonRequest);
      seasonResponse = new SeasonResponseBuilder(createdSeason.id)
        .setLeague(createdSeason.league)
        .setStartDate(createdSeason.start_date)
        .setEndDate(createdSeason.end_date)
        .setActiveSeason(createdSeason.active_season)
        .build();
      successResponse = new SuccessResponseBuilder(200)
        .setData(seasonResponse)
        .setMessage('Successfully created season')
        .build();
      logger.info(`Success POST season/create`);
      res.status(200).json(successResponse);
    } catch (e) {
      logger.error(`Cannot add season POST season/create with error ${e}`);
      next(e);
    }
  }

  private async deleteSeason (req: Request, res: Response, next: NextFunction): Promise<void> {
    const seasonId: string = req.params.id;
    let successResponse: SuccessResponse;
    try {
      await this._seasonController.deleteSeason(seasonId);
      successResponse = new SuccessResponseBuilder(200)
        .setMessage(`Successfully deleted season with id: ${seasonId}`)
        .build();
      logger.info(`Success DELETE season/${seasonId}`);
      res.status(200).json(successResponse);
    } catch (e) {
      logger.error(`Cannot DELETE season/${seasonId} with error ${e}`);
      next(e);
    }
  }
}

/* ------------------ DOCS -----------------------------------*/
/**
 * @api {get} /season Request all seasons
 * @apiName GetSeason
 * @apiGroup Seasons
 *
 * @apiSuccess {Number} status Status code
 * @apiSuccess {Object[]} response Successful response object with season data
 * @apiSuccess {Number} response.id Seasons unique id
 * @apiSuccess {String} response.league Seasons league (NFL or NCAA only)
 * @apiSuccess {Date} response.start_date Date of seasons start
 * @apiSuccess {Date} response.end_date Date of seasons end
 * @apiSuccess {Boolean} response.active_seasons Seasons active or inactive
 * @apiSuccess {Date} response.created_at Date of users account creation
 * @apiSuccess {Date} response.updated_at Date of users last update
 * @apiSuccess {String} message Success Message
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       response: [
 *                  {
 *                    id: 2,
 *                    league: "NFL",
 *                    start_date: "2017-10-15T05:00:00.000Z",
 *                    end_date: "2018-02-25T06:00:00.000Z",
 *                    active_season: true,
 *                    created_at: "2017-12-10T02:33:07.447Z",
 *                    updated_at: "2017-12-10T02:33:07.447Z"
 *                  },
 *                  {
 *                    id: 1,
 *                    league: "NCAA",
 *                    start_date: "2017-10-06T05:00:00.000Z",
 *                    end_date: "2018-02-11T06:00:00.000Z",
 *                    active_season: true,
 *                    created_at: "2017-12-10T02:33:07.447Z",
 *                    updated_at: "2017-12-10T02:33:07.447Z"
 *                  }
 *                ],
 *                status: 200,
 *                message: "success"
 *               }
 * @apiError SeasonsNotFound The response of no seasons found or an error grabbing them.
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       status: 404,
 *       response: "unexpected error occured",
 *       message: "error"
 *     }
 */

/**
 * @api {get} /season/college Request current college season
 * @apiName GetCurrentCollegeSeason
 * @apiGroup Seasons
 *
 * @apiSuccess {Number} status Status code
 * @apiSuccess {Object} response Successful response object with season data
 * @apiSuccess {Number} response.id Seasons unique id
 * @apiSuccess {String} response.league Seasons league (NFL or NCAA only)
 * @apiSuccess {Date} response.start_date Date of seasons start
 * @apiSuccess {Date} response.end_date Date of seasons end
 * @apiSuccess {Boolean} response.active_seasons Seasons active or inactive
 * @apiSuccess {Date} response.created_at Date of users account creation
 * @apiSuccess {Date} response.updated_at Date of users last update
 * @apiSuccess {String} message Success Message
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       status: 200,
 *       response: {
 *         id: 1,
 *         league: "NCAA",
 *         start_date: "2017-10-06T05:00:00.000Z",
 *         end_date: "2018-02-11T06:00:00.000Z",
 *         active_season: true,
 *         created_at: "2017-12-10T02:33:07.447Z",
 *         updated_at: "2017-12-10T02:33:07.447Z"
 *        },
 *       message: "success"
 *     }
 * @apiError SeasonNotFound No current season was found or unexpected error
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       status: 404,
 *       response: "unexpected error occured",
 *       message: "error"
 *     }
 */

/**
 * @api {get} /season/nfl Request current nfl season
 * @apiName GetCurrentNflSeason
 * @apiGroup Seasons
 *
 * @apiSuccess {Number} status Status code
 * @apiSuccess {Object} response Successful response object with season data
 * @apiSuccess {Number} response.id Seasons unique id
 * @apiSuccess {String} response.league Seasons league (NFL or NCAA only)
 * @apiSuccess {Date} response.start_date Date of seasons start
 * @apiSuccess {Date} response.end_date Date of seasons end
 * @apiSuccess {Boolean} response.active_seasons Seasons active or inactive
 * @apiSuccess {Date} response.created_at Date of users account creation
 * @apiSuccess {Date} response.updated_at Date of users last update
 * @apiSuccess {String} message Success Message
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       status: 200,
 *       response: {
 *         id: 2,
 *         league: "NFL",
 *         start_date: "2017-10-06T05:00:00.000Z",
 *         end_date: "2018-02-11T06:00:00.000Z",
 *         active_season: true,
 *         created_at: "2017-12-10T02:33:07.447Z",
 *         updated_at: "2017-12-10T02:33:07.447Z"
 *        },
 *       message: "success"
 *     }
 * @apiError SeasonNotFound No current season was found or unexpected error
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       status: 404,
 *       response: "unexpected error occured",
 *       message: "error"
 *     }
 */

/**
 * @api {get} /season Request all active seasons
 * @apiName GetActiveSeasons
 * @apiGroup Seasons
 *
 * @apiSuccess {Number} status Status code
 * @apiSuccess {Object[]} response Successful response object with season data
 * @apiSuccess {Number} response.id Seasons unique id
 * @apiSuccess {String} response.league Seasons league (NFL or NCAA only)
 * @apiSuccess {Date} response.start_date Date of seasons start
 * @apiSuccess {Date} response.end_date Date of seasons end
 * @apiSuccess {Boolean} response.active_seasons Seasons active or inactive
 * @apiSuccess {Date} response.created_at Date of users account creation
 * @apiSuccess {Date} response.updated_at Date of users last update
 * @apiSuccess {String} message Success Message
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       response: [
 *                  {
 *                    id: 2,
 *                    league: "NFL",
 *                    start_date: "2017-10-15T05:00:00.000Z",
 *                    end_date: "2018-02-25T06:00:00.000Z",
 *                    active_season: true,
 *                    created_at: "2017-12-10T02:33:07.447Z",
 *                    updated_at: "2017-12-10T02:33:07.447Z"
 *                  },
 *                  {
 *                    id: 1,
 *                    league: "NCAA",
 *                    start_date: "2017-10-06T05:00:00.000Z",
 *                    end_date: "2018-02-11T06:00:00.000Z",
 *                    active_season: true,
 *                    created_at: "2017-12-10T02:33:07.447Z",
 *                    updated_at: "2017-12-10T02:33:07.447Z"
 *                  }
 *                ],
 *                status: 200,
 *                message: "success"
 *               }
 * @apiError SeasonsNotFound The response of no seasons found or an error grabbing them.
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       status: 404,
 *       response: "unexpected error occured",
 *       message: "error"
 *     }
 */
