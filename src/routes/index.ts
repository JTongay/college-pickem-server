import {Request, Response, NextFunction, Router} from 'express';
import { logger } from '../services';
import { BaseRoute } from './baseRoute';

export class ApiRoutes extends BaseRoute{
  public static path: string = '/api';
  private static instance: ApiRoutes;

  constructor() {
    super();
    this.init();
  }

  /**
   * @class ApiRoute
   * @method getRouter
   * @returns {Router}
   */
  static get router () {
    if (!ApiRoutes.instance) {
      ApiRoutes.instance = new ApiRoutes();
    }
    return ApiRoutes.instance.router;
  }

  private init(): void {
    logger.info('Creating Api routes')
  }

  private async get (req: Request, res: Response, next: NextFunction) {
    res.status(200).json({ online: true });
  }
}
