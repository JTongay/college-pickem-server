import { BaseRoute } from '@/routes/baseRoute';
import { IAuthService, AuthService, logger } from '@/services';
import { Router, Request, Response, NextFunction } from 'express';
import { IUserController } from '@/controllers';
import { container } from '@/inversify.config';
import { TYPES } from '@/types.classes';
import { User, UserRequest } from '@/models';
import { interfaces } from 'inversify';

export class UserRoutes extends BaseRoute {
  private static instance: UserRoutes;
  private _userController: IUserController;
  private _authService: IAuthService;

  constructor (
    private UserController: IUserController,
    private AuthService: IAuthService
  ) {
    super();
    this._userController = UserController;
    this._authService = AuthService;
    this.getUser = this.getUser.bind(this);
    this.getUsers = this.getUsers.bind(this);
    this.createUser = this.createUser.bind(this);
    this.validateForm = this.validateForm.bind(this);
    this.init();
  }

  static get router (): Router {
    if (!UserRoutes.instance) {
      UserRoutes.instance = new UserRoutes(
        container.get<IUserController>(TYPES.IUserController),
        container.get<IAuthService>(TYPES.IAuthService)
      );
    }
    return UserRoutes.instance.router;
  }

  private init (): void {
    logger.info('Creating UserRoutes');

    this.router.get('/', this.getUsers);
    this.router.get('/:id', this.getUser);
    this.router.post('/', this.createUser);
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

  /**
   *
   * @param {Request} req: The incoming request new UserRequest
   * @param {Response} res: The response to send
   * @param {e.NextFunction} next
   * @returns {Promise<void>}
   */
  private async createUser (req: Request, res: Response, next: NextFunction): Promise<void> {
    let createdUser: User;
    let token: string;
    const requestedUser: UserRequest = new UserRequest(
      req.body.userName,
      req.body.password,
      req.body.firstName,
      req.body.lastName,
      req.body.email
    );
    if (!this.validateForm(requestedUser)) {
      res.status(404).json({ error_code: 'form.invalid' });
    }
    try {
      createdUser = await this._userController.createUser(requestedUser);
      token = this._authService.generateToken(createdUser.id.toString());
      res.json(token);
    } catch (e) {
      res.status(404);
      next(e);
    }
  }

  // private async editUser (req: Request, res: Response, next: NextFunction): Promise<any> {
  //   const userName: string = req.body.userName;
  //   let response: any;
  //   try {
  //     response = await this._userController
  //   }
  // }

  private validateForm (requestedUser: UserRequest): boolean {
    for (const val in requestedUser) {
      if (!requestedUser[val]) {
        return false;
      }
    }
    return true;
  }

}
