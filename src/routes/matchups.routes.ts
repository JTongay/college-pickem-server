import { BaseRoute } from '@/routes/baseRoute';
import { logger } from '@/services';
import { Router } from 'express';

export class MatchupsRoutes extends BaseRoute {
  private static instance: MatchupsRoutes;

  constructor () {
    super();
  }

  private init (): void {
    logger.info('Creating MatchupsRoutes');
  }

  static get router (): Router {
    if (!MatchupsRoutes.instance) {
      MatchupsRoutes.instance = new MatchupsRoutes();
    }
    return MatchupsRoutes.instance.router;
  }
}
