import { User } from '@/models';
import { GenericBuilder } from '@/builders';

export class UserResponseBuilder extends GenericBuilder {
  private username: string;
  private first_name: string;
  private last_name: string;
  private email: string;
  private password: string;
  private token: string;
  private created_at: Date;
  private updated_at: Date;

  constructor (username: string) {
    super();
    this.username = username;
  }

  get Username (): string {
    return this.username;
  }

  public setFirstName (value: string): UserResponseBuilder {
    this.first_name = value;
    return this;
  }

  get FirstName (): string {
    return this.first_name;
  }

  public setLastName (value: string): UserResponseBuilder {
    this.last_name = value;
    return this;
  }

  get LastName (): string {
    return this.last_name;
  }

  public setEmail (value: string): UserResponseBuilder {
    this.email = value;
    return this;
  }

  get Email (): string {
    return this.email;
  }

  public setPassword (value: string): UserResponseBuilder {
    this.password = value;
    return this;
  }

  get Password (): string {
    return this.password;
  }

  public setCreatedDate (value: Date): UserResponseBuilder {
    this.created_at = value;
    return this;
  }

  get CreatedDate (): Date {
    return this.created_at;
  }

  public setUpdatedDate (value: Date): UserResponseBuilder {
    this.updated_at = value;
    return this;
  }

  get UpdateDate (): Date {
    return this.updated_at;
  }

  public setToken (value: string): UserResponseBuilder {
    this.token = value;
    return this;
  }

  get Token (): string {
    return this.token;
  }

  public build (): UserResponse {
    return new UserResponse(this);
  }
}

export class UserResponse {

  private username: string;
  private first_name: string;
  private last_name: string;
  private email: string;
  private password: string;
  private token: string;
  private created_at: Date;
  private updated_at: Date;

  constructor (builder: UserResponseBuilder) {
    this.username = builder.Username;
    this.first_name = builder.FirstName;
    this.last_name = builder.LastName;
    this.email = builder.Email;
    this.password = builder.Password;
    this.token = builder.Token;
    this.created_at = builder.CreatedDate;
    this.updated_at = builder.UpdateDate;
  }

  get Username (): string {
    return this.username;
  }

  get FirstName (): string {
    return this.first_name;
  }

  get LastName (): string {
    return this.last_name;
  }

  get Email (): string {
    return this.email;
  }

  get Password (): string {
    return this.password;
  }

  get CreatedDate (): Date {
    return this.created_at;
  }

  get UpdateDate (): Date {
    return this.updated_at;
  }

  get Token (): string {
    return this.token;
  }
}
