import { Connection } from '@/db/connection';
import { IUserController } from '@/controllers';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { User, UserRequest } from '@/models';
import { AuthService, IAuthService, logger } from '@/services';
import { TYPES } from '@/types.classes';

@injectable()
export class UserController extends Connection implements IUserController {

  private _authService: IAuthService;

  constructor (
    @inject(TYPES.IAuthService) authService: IAuthService
  ) {
    super();
    this._authService = authService;
    this.getUserByUsername = this.getUserByUsername.bind(this);
  }

  public async getJoey (): Promise<User> {
    // return await
    let response;
    try {
      response = await this.knex().table('users').where('id', 1).first();
      return response;
    } catch (e) {
      return e;
    }
  }

  public async getUserById (id: string): Promise<User> {
    let response: User;
    try {
      response = await this.knex().table('users').where('id', id).first();
      return response;
    } catch (e) {
      logger.error(`Error getting user with id: ${id} with message ${e}`);
      throw new Error(e);
    }
  }

  public async getUsers (): Promise<User[]> {
    let response: User[];
    try {
      response = await this.knex().table('users');
      return response;
    } catch (e) {
      logger.error(`Error getting users with message ${e}`);
      throw new Error(e);
    }
  }

  /**
   *
   * @param {UserRequest} requestedUser: The UserRequest object coming from the Front End
   * @returns {Promise<void>}
   */
  public async createUser (requestedUser: UserRequest): Promise<User> {
    const existingUser: User = await this.getUserByUsername(requestedUser.username);
    if (!existingUser) {
      let hashedPassword: string;
      let newUser: User;
      try {
        // hash the password
        hashedPassword = await this._authService.hashPassword(requestedUser.password);
        // replace the requested password with the hashed password
        requestedUser.password = hashedPassword;
        // insert the requestedUser
        newUser = await this.knex().table('users').insert(requestedUser).returning('*');
        logger.info(`Successfully created ${requestedUser.username}`);
        return newUser[0];
      } catch (e) {
        logger.error(`Error inserting ${requestedUser.username} with message ${e}`);
        throw new Error(e);
      }
    } else {
      throw new Error('User already exists');
    }
  }

  /**
   *
   * @param {string} username: the requested username from the form
   * @returns {Promise<User>}
   */
  private async getUserByUsername (username: string): Promise<User> {
    let response: User;
    try {
      response = await this.knex().table('users').where('username', username).first();
      return response;
    } catch (e) {
      throw new Error(e);
    }
  }
}


