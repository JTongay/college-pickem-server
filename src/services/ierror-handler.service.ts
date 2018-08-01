import { IError } from '@/services/error-handler.service';

export interface IErrorHandlerService {
  userNotFound (id: string): IError;
  userAlreadyExists (username: string): IError;
  formInvalid (): IError;
}
