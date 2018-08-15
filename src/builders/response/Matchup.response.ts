import { GenericBuilder } from '@/builders';
import { Team } from '@/models';

export class MatchupResponseBuilder extends GenericBuilder {
  private id: number;
  private season_id: number;
  private week: number;
  private match: number;
  private location: string;
  private league: string;
  private home: Team;
  private away: Team;

  constructor (id: number) {
    super();
    this.id = id;
  }

  get Id (): number {
    return this.id;
  }

  public setSeasonId (val: number): MatchupResponseBuilder {
    this.season_id = val;
    return this;
  }

  get SeasonId (): number {
    return this.season_id;
  }

  public setWeek (val: number): MatchupResponseBuilder {
    this.week = val;
    return this;
  }

  get Week (): number {
    return this.week;
  }

  public setMatch (val: number): MatchupResponseBuilder {
    this.match = val;
    return this;
  }

  get Match (): number {
    return this.match;
  }

  public setLocation (val: string): MatchupResponseBuilder {
    this.location = val;
    return this;
  }

  get Location (): string {
    return this.location;
  }

  public setLeague (val: string): MatchupResponseBuilder {
    this.league = val;
    return this;
  }

  get League (): string {
    return this.league;
  }

  public setHome (val: Team): MatchupResponseBuilder {
    this.home = val;
    return this;
  }

  get Home (): Team {
    return this.home;
  }

  public setAway (val: Team): MatchupResponseBuilder {
    this.away = val;
    return this;
  }

  get Away (): Team {
    return this.away;
  }

  public build (): MatchupResponse {
    return new MatchupResponse(this);
  }
}

export class MatchupResponse {
  private id: number;
  private season_id: number;
  private week: number;
  private match: number;
  private location: string;
  private league: string;
  private home: Team;
  private away: Team;

  constructor (builder: MatchupResponseBuilder) {
    this.id = builder.Id;
    this.season_id = builder.SeasonId;
    this.week = builder.Week;
    this.match = builder.Match;
    this.location = builder.Location;
    this.league = builder.League;
    this.home = builder.Home;
    this.away = builder.Away;
  }

  get Id (): number {
    return this.id;
  }

  get SeasonId (): number {
    return this.season_id;
  }

  get Week (): number {
    return this.week;
  }

  get Match (): number {
    return this.match;
  }

  get Location (): string {
    return this.location;
  }

  get League (): string {
    return this.league;
  }

  get Home (): Team {
    return this.home;
  }

  get Away (): Team {
    return this.away;
  }
}
