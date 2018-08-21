import { GenericBuilder } from '@/builders';
import { UserResponse, UserResponseBuilder } from '@/builders/response/User.response';
import { User } from '@/models';

export class ScoreResponseBuilder extends GenericBuilder {
  private id: number;
  private score: number;
  private user_id: number;
  private season_id: number;
  private week: number;
  private total_score: number;
  private created_at: Date;
  private updated_at: Date;
  private user: UserResponse;

  constructor (id: number) {
    super();
    this.id = id;
  }

  get Id (): number {
    return this.id;
  }

  public setScore (val: number): ScoreResponseBuilder {
    this.score = val;
    return this;
  }

  get Score (): number {
    return this.score;
  }

  public setUserId (val: number): ScoreResponseBuilder {
    this.user_id = val;
    return this;
  }

  get UserId (): number {
    return this.user_id;
  }

  public setSeasonId (val: number): ScoreResponseBuilder {
    this.season_id = val;
    return this;
  }

  get SeasonId (): number {
    return this.season_id;
  }

  public setWeek (val: number): ScoreResponseBuilder {
    this.week = val;
    return this;
  }

  get Week (): number {
    return this.week;
  }

  public setTotalScore (val: number): ScoreResponseBuilder {
    this.total_score = val;
    return this;
  }

  get TotalScore (): number {
    return this.total_score;
  }

  public setCreatedAt (val: Date): ScoreResponseBuilder {
    this.created_at = val;
    return this;
  }

  get CreatedAt (): Date {
    return this.created_at;
  }

  public setUpdatedAt (val: Date): ScoreResponseBuilder {
    this.updated_at = val;
    return this;
  }

  get UpdatedAt (): Date {
    return this.updated_at;
  }

  public setUser (val: User): ScoreResponseBuilder {
    this.user = new UserResponseBuilder(val.username)
      .setFirstName(val.first_name)
      .setLastName(val.last_name)
      .setEmail(val.email)
      .setCreatedDate(val.created_at)
      .build();
    return this;
  }

  get User (): UserResponse {
    return this.user;
  }

  public build (): ScoreResponse {
    return new ScoreResponse(this);
  }
}

export class ScoreResponse {
  private id: number;
  private score: number;
  private user_id: number;
  private user: UserResponse;
  private season_id: number;
  private week: number;
  private total_score: number;
  private created_at: Date;
  private updated_at: Date;

  constructor (builder: ScoreResponseBuilder) {
    this.id = builder.Id;
    this.score = builder.Score;
    this.user_id = builder.UserId;
    this.user = builder.User;
    this.season_id = builder.SeasonId;
    this.week = builder.Week;
    this.total_score = builder.TotalScore;
    this.created_at = builder.CreatedAt;
    this.updated_at = builder.UpdatedAt;
  }

  get Id (): number {
    return this.id;
  }

  get Score (): number {
    return this.score;
  }

  get UserId (): number {
    return this.user_id;
  }

  get SeasonId (): number {
    return this.season_id;
  }

  get Week (): number {
    return this.week;
  }

  get TotalScore (): number {
    return this.total_score;
  }

  get CreatedAt (): Date {
    return this.created_at;
  }

  get UpdatedAt (): Date {
    return this.updated_at;
  }

}
