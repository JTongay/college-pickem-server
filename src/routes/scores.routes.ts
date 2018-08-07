import { BaseRoute } from '@/routes/baseRoute';
import { logger } from '@/services';
import { NextFunction, Request, Router, Response } from 'express';
import { IScoreController, ISeasonController, IUserController } from '@/controllers';
import { container } from '@/inversify.config';
import { TYPES } from '@/types.classes';

export class ScoresRoutes extends BaseRoute {
  private static instance: ScoresRoutes;
  private _userController: IUserController;
  private _scoreController: IScoreController;

  constructor (
    private ScoreController: IScoreController
  ) {
    super();
    this._scoreController = ScoreController;
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
  }

  private async getAllScoresBySeasonAndUser (req: Request, res: Response, next: NextFunction): Promise<void> {
    const userId: string = req.params.user_id;
    const seasonId: string = req.params.season_id;
    // const response: any;
  }
}
