import { Request } from 'express';

export class SeasonRequest {
  league: string;
  start_date: Date;
  end_date: Date;
  active_season: boolean;

  constructor (body: any) {
    this.league = body.league;
    this.start_date = body.startDate;
    this.end_date = body.endDate;
    this.active_season = true;
  }
}
