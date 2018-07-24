import { Container } from 'inversify';
import { TYPES } from './types.classes';
import { UserController, IUserController } from '@/controllers';

const container: Container = new Container();
container.bind<IUserController>(TYPES.IUserController).to(UserController);

export { container };
