import { BaseRoute } from '@/routes/baseRoute';
import { logger } from '@/services';
import { NextFunction, Request, Response, Router } from 'express';
import { IMatchupController, ITeamController } from '@/controllers';
import { container } from '@/inversify.config';
import { TYPES } from '@/types.classes';
import { Matchup, Team } from '@/models';
import {
  ErrorResponse, ErrorResponseBuilder, MatchupResponse, MatchupResponseBuilder, SuccessResponse,
  SuccessResponseBuilder
} from '@/builders/response';
import { ErrorCodes } from '@/utils';

export class MatchupsRoutes extends BaseRoute {
  private static instance: MatchupsRoutes;
  private _matchupController: IMatchupController;
  private _teamController: ITeamController;

  constructor (
    private MatchupController: IMatchupController,
    private TeamController: ITeamController
  ) {
    super();
    this._matchupController = MatchupController;
    this._teamController = TeamController;
    this.getAllMatchups = this.getAllMatchups.bind(this);
    this.getMatchupsByWeek = this.getMatchupsByWeek.bind(this);
    this.init();
  }

  private init (): void {
    logger.info('Creating MatchupsRoutes');

    this.router.get('/', this.getAllMatchups);
    this.router.get('/:id', this.getMatchupsByWeek);
  }

  static get router (): Router {
    if (!MatchupsRoutes.instance) {
      MatchupsRoutes.instance = new MatchupsRoutes(
        container.get<IMatchupController>(TYPES.IMatchupController),
        container.get<ITeamController>(TYPES.ITeamController)
      );
    }
    return MatchupsRoutes.instance.router;
  }

  private async getAllMatchups (req: Request, res: Response, next: NextFunction): Promise<void> {
    const seasonId: string = req.params.season_id;
    let fullMatchups: Matchup[];
    try {
      fullMatchups = await this._matchupController.getAllCurrentMatchups(seasonId);
      res.status(200).json(fullMatchups);
    } catch (e) {
      next(e);
    }
  }

  private async getMatchupsByWeek (req: Request, res: Response, next: NextFunction): Promise<void> {
    const seasonId: string = req.params.season_id;
    const week: string = req.params.id;
    let fullMatchups: Matchup[];
    let homeTeamData: Team;
    let awayTeamData: Team;
    let successResponse: SuccessResponse;
    let errorResponse: ErrorResponse;
    const fullSchedule: MatchupResponse[] = [];
    try {
      fullMatchups = await this._matchupController.getMatchupsByWeek(seasonId, week);
      if (!fullMatchups.length) {
        errorResponse = new ErrorResponseBuilder(404)
          .setErrorCode(ErrorCodes.matchupsNotFound)
          .build();
        res.status(404).json(errorResponse);
        return;
      }
      for (let i = 0; i < fullMatchups.length; i++) {
        let matchup: any;
        // get the home and away team for each matchup
        homeTeamData = await this._teamController.getTeam(fullMatchups[i].home_team_id.toString(), seasonId);
        awayTeamData = await this._teamController.getTeam(fullMatchups[i].away_team_id.toString(), seasonId);
        // assign the team to the home or away property
        fullMatchups[i]['home'] = homeTeamData;
        fullMatchups[i]['away'] = awayTeamData;
        // Build a matchup object
        matchup = new MatchupResponseBuilder(fullMatchups[i].id)
          .setSeasonId(fullMatchups[i].season_id)
          .setMatch(fullMatchups[i].match)
          .setLeague(fullMatchups[i].league)
          .setLocation(fullMatchups[i].location)
          .setWeek(fullMatchups[i].week)
          .setHome(homeTeamData)
          .setAway(awayTeamData)
          .build();
        // Push to the Full Matchup Schedule array
        fullSchedule.push(matchup);
      }
      // build the successful response
      successResponse = new SuccessResponseBuilder(200)
        .setMessage('Got all matchups')
        .setData(fullSchedule)
        .build();
      // send it out
      res.status(200).json(successResponse);
    } catch (e) {
      next(e);
    }
  }

}
