import { BaseRoute } from '@/routes/baseRoute';
import { NextFunction, Request, Response, Router } from 'express';
import { IAuthService, logger } from '@/services';
import { container } from '@/inversify.config';
import { TYPES } from '@/types.classes';
import { User } from '@/models';
import { IUserController } from '@/controllers';
import { ErrorResponse, ErrorResponseBuilder, SuccessResponse, SuccessResponseBuilder } from '@/builders/response';
import { ErrorCodes } from '@/utils';

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
    let errorResponse: ErrorResponse;
    if (!username || !password) {
      errorResponse = new ErrorResponseBuilder(400)
        .setErrorCode(ErrorCodes.userPassRequired)
        .build();
      res.status(400).json(errorResponse);
      return;
    }
    try {
      user = await this._userController.getUserByUsername(username);
      if (!user) {
        res.status(404).json(ErrorCodes.userPassMismatch);
        return;
      }
      passwordMatch = this._authService.verifyPassword(password, user.password);
      if (!passwordMatch) {
        res.status(404).json(ErrorCodes.userPassMismatch);
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
