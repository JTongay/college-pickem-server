import { BaseRoute } from '@/routes/baseRoute';
import { NextFunction, Request, Response, Router } from 'express';
import { IAuthService, logger } from '@/services';
import { container } from '@/inversify.config';
import { TYPES } from '@/types.classes';
import { User } from '@/models';
import { IUserController } from '@/controllers';
import { SuccessResponse, SuccessResponseBuilder } from '@/builders/response';

export class AuthRoutes extends BaseRoute {
  private static instance: AuthRoutes;
  private _authService: IAuthService;
  private _userController: IUserController;

  constructor (
    private AuthService: IAuthService,
    private UserController: IUserController
  ) {
    super();
    this._authService = AuthService;
    this._userController = UserController;
    this.login = this.login.bind(this);
    this.init();
  }

  static get router (): Router {
    if (!AuthRoutes.instance) {
      AuthRoutes.instance = new AuthRoutes(
        container.get<IAuthService>(TYPES.IAuthService),
        container.get<IUserController>(TYPES.IUserController)
      );
    }
    return AuthRoutes.instance.router;
  }

  private init (): void {
    logger.info('Creating AuthRoutes');

    this.router.post('/', this.login);
  }

  private async login (req: Request, res: Response, next: NextFunction): Promise<void> {
    const { username, password } = req.body;
    let user: User;
    let passwordMatch: boolean;
    let successResponse: SuccessResponse;
    if (!username || !password) {
      // TODO: build a validation error response
      res.status(400);
      return;
    }
    try {
      user = await this._userController.getUserByUsername(username);
      passwordMatch = await this._authService.verifyPassword(password, user.password);
      if (!user || !passwordMatch) {
        // TODO: Build an error response for invalid username/password
        res.status(404);
        return;
      }

      const token: string = this._authService.generateToken(user.id.toString());
      successResponse = new SuccessResponseBuilder(200)
        .setToken(token)
        .setMessage('Successfully Logged In')
        .build();
      res.status(200).json(successResponse);
    } catch (e) {
      next(e);
    }
  }

}
