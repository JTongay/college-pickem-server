import { BaseRoute } from '@/routes/baseRoute';
import { logger } from '@/services';
import { NextFunction, Request, Response, Router } from 'express';
import { IMatchupController, ITeamController } from '@/controllers';
import { container } from '@/inversify.config';
import { TYPES } from '@/types.classes';
import { Matchup } from '@/models';

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
    let homeTeamData: any;
    try {
      fullMatchups = await this._matchupController.getMatchupsByWeek(seasonId, week);
      if (!fullMatchups.length) {
        res.status(404).json([]);
      }
      fullMatchups.forEach((match) => {})
      homeTeamData = await this._teamController.getTeam(fullMatchups[0].home_team_id.toString(), seasonId);
      res.status(200).json(homeTeamData);
    } catch (e) {
      next(e);
    }
  }

}
