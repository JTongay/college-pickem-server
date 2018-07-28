import { IAuthService } from '@/services/iauth.service';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { injectable } from 'inversify';
import 'reflect-metadata';

@injectable()
export class AuthService implements IAuthService {
  constructor () {}
  /**
   *
   * @param {string} userId
   * @returns {string}
   */
  public generateToken (userId: string): string {
    return jwt.sign({id: userId}, process.env.JWT_SECRET);
  }

  /**
   *
   * @param {string} token
   * @returns {string | object}
   */
  public verifyToken (token: string): string | object {
    return jwt.verify(token, process.env.JWT_SECRET);
  }

  /**
   *
   * @param {string} password
   * @returns {Promise<string>}
   */
  public async hashPassword (password: string): Promise<string> {
    return await bcrypt.hashSync(password, 12);
  }

  /**
   *
   * @param {string} passwordRequest
   * @param {string} passwordResponse
   * @returns {Promise<boolean>}
   */
  public async verifyPassword (passwordRequest: string, passwordResponse: string): Promise<boolean> {
    return await bcrypt.compareSync(passwordRequest, passwordResponse);
  }
}
