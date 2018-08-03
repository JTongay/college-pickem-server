import { BaseRoute } from '@/routes/baseRoute';
import { logger } from '@/services';
import { Router } from 'express';

export class PicksRoutes extends BaseRoute {
  private static instance: PicksRoutes;

  constructor () {
    super();
  }

  private init (): void {
    logger.info('Creating PicksRoutes');
  }

  static get router (): Router {
    if (!PicksRoutes.instance) {
      PicksRoutes.instance = new PicksRoutes();
    }
    return PicksRoutes.instance.router;
  }
}
