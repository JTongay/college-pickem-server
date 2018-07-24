import { Connection } from '@/db/connection';
import { IUserController } from '@/controllers';
import { injectable } from 'inversify';
import 'reflect-metadata';
import { User } from '@/models';

@injectable()
export class UserController extends Connection implements IUserController {

  constructor () {
    super();
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

}
