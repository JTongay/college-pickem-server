import { User } from '@/models';

export interface IUserController {
  getJoey (): Promise<User>;
}
