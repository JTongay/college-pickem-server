import { BaseRoute } from '@/routes/baseRoute';
import { logger } from '@/services';
import { Router } from 'express';

export class ScoresRoutes extends BaseRoute {
  private static instance: ScoresRoutes;

  constructor () {
    super();
    this.init();
  }

  static get router (): Router {
    if (!ScoresRoutes.instance) {
      ScoresRoutes.instance = new ScoresRoutes();
    }
    return ScoresRoutes.instance.router;
  }

  private init (): void {
    logger.info('Creating ScoresRoutes');
  }
}
