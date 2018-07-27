import { User } from '@/models';

export interface IUserController {
  getJoey (): Promise<User>;
  getUserById (id: string): Promise<User>;
  getUsers (): Promise<User[]>;
  createUser (): Promise<void>;
}
