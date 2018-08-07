import { GenericBuilder } from '@/builders';

export class SeasonResponseBuilder extends GenericBuilder {
  private id: number;
  private league: string;
  private start_date: Date;
  private end_date: Date;
  private active_season: boolean;
  private created_at: Date;
  private updated_at: Date;

  constructor (id: number) {
    super();
    this.id = id;
  }

  get Id (): number {
    return this.id;
  }

  get League (): string {
    return this.league;
  }

  public setLeague (val: string): SeasonResponseBuilder {
    this.league = val;
    return this;
  }

  get StartDate (): Date {
    return this.start_date;
  }

  public setStartDate (val: Date): SeasonResponseBuilder {
    this.start_date = val;
    return this;
  }

  get EndDate (): Date {
    return this.end_date;
  }

  public setEndDate (val: Date): SeasonResponseBuilder {
    this.end_date = val;
    return this;
  }

  get ActiveSeason (): boolean {
    return this.active_season;
  }

  public setActiveSeason (val: boolean): SeasonResponseBuilder {
    this.active_season = val;
    return this;
  }

  get CreatedDate (): Date {
    return this.created_at;
  }

  public setCreatedDate (val: Date): SeasonResponseBuilder {
    this.created_at = val;
    return this;
  }

  get UpdatedDate (): Date {
    return this.updated_at;
  }

  public setUpdatedDate (val: Date): SeasonResponseBuilder {
    this.updated_at = val;
    return this;
  }

  public build (): SeasonResponse {
    return new SeasonResponse(this);
  }
}

export class SeasonResponse {
  private id: number;
  private league: string;
  private start_date: Date;
  private end_date: Date;
  private active_season: boolean;
  private created_at: Date;
  private updated_at: Date;

  constructor (builder: SeasonResponseBuilder) {
    this.id = builder.Id;
    this.league = builder.League;
    this.start_date = builder.StartDate;
    this.end_date = builder.EndDate;
    this.active_season = builder.ActiveSeason;
    this.created_at = builder.CreatedDate;
    this.updated_at = builder.UpdatedDate;
  }
  get Id (): number {
    return this.id;
  }

  get League (): string {
    return this.league;
  }

  get StartDate (): Date {
    return this.start_date;
  }

  get EndDate (): Date {
    return this.end_date;
  }

  get ActiveSeason (): boolean {
    return this.active_season;
  }

  get CreatedDate (): Date {
    return this.created_at;
  }

  get UpdatedDate (): Date {
    return this.updated_at;
  }
}
