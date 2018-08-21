import { User, UserRequest } from '@/models';

export interface IUserController {
  getJoey (): Promise<User>;
  getUserById (id: string): Promise<User>;
  getUsers (): Promise<User[]>;
  createUser (requestedUser: UserRequest): Promise<User>;
  getUserByUsername (username: string): Promise<User>;
}
