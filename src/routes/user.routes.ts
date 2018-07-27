import { BaseRoute } from '@/routes/baseRoute';
import { logger } from '@/services';
import { Router, Request, Response, NextFunction } from 'express';
import { IUserController } from '@/controllers';
import { container } from '@/inversify.config';
import { TYPES } from '@/types.classes';
import { User } from '@/models';

export class UserRoutes extends BaseRoute {
  private static instance: UserRoutes;
  private _userController: IUserController;

  constructor (
    private UserController: IUserController
  ) {
    super();
    this._userController = UserController;
    this.getUser = this.getUser.bind(this);
    this.getUsers = this.getUsers.bind(this);
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

    this.router.get('/', this.getUsers);
    this.router.get('/:id', this.getUser);
  }

  /**
   *
   * @param {e.Request} req
   * @param {e.Response} res
   * @param {e.NextFunction} next
   * @returns {Promise<void>}
   */
  private async getUser (req: Request, res: Response, next: NextFunction): Promise<void> {
    const userId: string = req.params.id;
    let user: User;
    try {
      user = await this._userController.getUserById(userId);
      if (!user) {
        res.status(400).json({});
      }
      res.status(200).json(user);
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
  private async getUsers (req: Request, res: Response, next: NextFunction): Promise<void> {
    let users: User[];
    try {
      users = await this._userController.getUsers();
      res.status(200).json(users);
    } catch (e) {
      next(e);
    }
  }

}
