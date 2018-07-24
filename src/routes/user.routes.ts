import { BaseRoute } from '@/routes/baseRoute';
import { logger } from '@/services';
import { Router } from 'express';
import { IUserController } from '@/controllers';
import { container } from '@/inversify.config';
import { TYPES } from '@/types.classes';

export class UserRoutes extends BaseRoute {
  private static instance: UserRoutes;
  private _userController: IUserController;

  constructor (
    private UserController: IUserController
  ) {
    super();
    this._userController = UserController;
    this.init();
  }

  static get router (): Router {
    if (!UserRoutes.instance) {
      UserRoutes.instance = new UserRoutes(
        container.get<IUserController>(TYPES.IUserController)
      );
    }
    return UserRoutes.instance.router;
  }

  private init (): void {
    logger.info('Creating UserRoutes');

  }
}
