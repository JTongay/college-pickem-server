import { BaseRoute } from '@/routes/baseRoute';
import { Router } from 'express';
import { logger } from '@/services';

export class SeasonsRoutes extends BaseRoute {
  private static instance: SeasonsRoutes;

  constructor () {
    super();
    this.init();
  }

  private init (): void {
    logger.info('Creating SeasonsRoutes');
  }

  static get router (): Router {
    // logger.info('creating SeasonsRoutes');
    if (!SeasonsRoutes.instance) {
      SeasonsRoutes.instance = new SeasonsRoutes();
    }
    return SeasonsRoutes.router;
  }


}
