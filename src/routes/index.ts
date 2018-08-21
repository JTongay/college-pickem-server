import { Request, Response, NextFunction, Router } from 'express';
import { logger } from '@/services';
import { BaseRoute } from './baseRoute';
import { IUserController } from '@/controllers';
import { TYPES } from '@/types.classes';
import { container } from '@/inversify.config';
import { UserRoutes } from '@/routes/user.routes';
import { SeasonsRoutes } from '@/routes/seasons.routes';
import { ScoresRoutes } from '@/routes/scores.routes';
import { MatchupsRoutes } from '@/routes/matchups.routes';
import { AuthRoutes } from '@/routes/auth.routes';

export class ApiRoutes extends BaseRoute {
  public static path: string = '/api';
  private static instance: ApiRoutes;
  private _userController: IUserController;

  constructor (
    private userController: IUserController
  ) {
    super();
    this._userController = userController;
    this.get = this.get.bind(this);
    this.init();
  }

  /**
   * @class ApiRoute
   * @method getRouter
   * @returns {Router}
   */
  static get router () {
    if (!ApiRoutes.instance) {
      ApiRoutes.instance = new ApiRoutes(container.get<IUserController>(TYPES.IUserController));
    }
    return ApiRoutes.instance.router;
  }

  private init (): void {
    logger.info('Creating Api routes');

    this.router.get('/', this.get);
    this.router.use('/user', UserRoutes.router);
    this.router.use('/session', AuthRoutes.router);
    this.router.use('/season', SeasonsRoutes.router);
    this.router.use('/season/:season_id/matchup', MatchupsRoutes.router);
    this.router.use('/season/:season_id/score', ScoresRoutes.router);
  }

  private async get (req: Request, res: Response, next: NextFunction) {
    res.status(200).json({ online: true });
  }
}
