import { Container } from 'inversify';
import { TYPES } from './types.classes';
import { UserController, IUserController } from '@/controllers';
import { AuthService, IAuthService } from '@/services';

const container: Container = new Container();
container.bind<IUserController>(TYPES.IUserController).to(UserController);
container.bind<IAuthService>(TYPES.IAuthService).to(AuthService);

export { container };
