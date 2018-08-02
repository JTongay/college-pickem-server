export interface IAuthService {
  generateToken (userId: string): string;
  verifyToken (token: string): string | object;
  hashPassword (password: string): Promise<string>;
  verifyPassword (passwordRequest: string, passwordResponse: string): Promise<boolean>;
}
