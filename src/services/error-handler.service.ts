import { IErrorHandlerService } from '@/services/ierror-handler.service';

export interface IError {
  status: number;
  response: string;
  error_code: string;
}

export class ErrorHandlerService implements IErrorHandlerService {

  public userNotFound (id: string): IError {
    return {
      status: 404,
      response: `no user found with id: ${id}`,
      error_code: 'user_not_found'
    };
  }

  public userAlreadyExists (username: string): IError {
    return {
      status: 409,
      response: `username: ${username} already exists`,
      error_code: 'user_already_exists'
    };
  }

  public formInvalid (): IError {
    return {
      status: 400,
      response: '',
      error_code: 'form.invalid'
    };
  }
}
