import { BaseRoute } from '@/routes/baseRoute';
import { Request, Router, Response, NextFunction } from 'express';
import { logger } from '@/services';
import { ISeasonController } from '@/controllers';
import { container } from '@/inversify.config';
import { TYPES } from '@/types.classes';
import { Season, SeasonRequest } from '@/models';
import { interfaces } from 'inversify';

export class SeasonsRoutes extends BaseRoute {
  private static instance: SeasonsRoutes;
  private _seasonController: ISeasonController;

  constructor (
    private SeasonController: ISeasonController
  ) {
    super();
    this._seasonController = SeasonController;
    this.getSeason = this.getSeason.bind(this);
    this.activateSeason = this.activateSeason.bind(this);
    this.deactivateSeason = this.deactivateSeason.bind(this);
    this.createSeason = this.createSeason.bind(this);
    this.deleteSeason = this.deleteSeason.bind(this);
    this.init();
  }

  private init (): void {
    logger.info('Creating SeasonsRoutes');

    this.router.get('/:id', this.getSeason);
    this.router.put('/:id/activate', this.activateSeason);
    this.router.put('/:id/deactivate', this.deactivateSeason);
    this.router.delete('/:id', this.deleteSeason);
    this.router.post('/create', this.createSeason);
  }

  static get router (): Router {
    // logger.info('creating SeasonsRoutes');
    if (!SeasonsRoutes.instance) {
      SeasonsRoutes.instance = new SeasonsRoutes(
        container.get<ISeasonController>(TYPES.ISeasonController)
      );
    }
    return SeasonsRoutes.router;
  }

  private async getSeason (req: Request, res: Response, next: NextFunction): Promise<void> {
    const seasonId: string = req.params.id;
    let season: Season;
    try {
      season = await this._seasonController.getSeasonById(seasonId);
      if (!season) {
        res.status(404).json({});
      }
      res.status(200).json(season);
    } catch (e) {
      logger.error(`error accessing route season/:id with error: ${e}`);
      next(e);
    }
  }

  private async activateSeason (req: Request, res: Response, next: NextFunction): Promise<void> {
    const seasonId: string = req.params.id;
    const season: Season = await this._seasonController.getSeasonById(seasonId);
    if (!season) {
      res.status(404).json({});
    }
    try {
      await this._seasonController.toggleSeason(seasonId, true);
      res.status(200).json(season);
    } catch (e) {
      logger.error(`Cannot activate PUT /${seasonId}/activate with error ${e}`);
      next(e);
    }
  }

  private async deactivateSeason (req: Request, res: Response, next: NextFunction): Promise<void> {
    const seasonId: string = req.params.id;
    const season: Season = await this._seasonController.getSeasonById(seasonId);
    if (!season) {
      res.status(404).json({});
    }
    try {
      await this._seasonController.toggleSeason(seasonId, false);
      res.status(200).json(season);
    } catch (e) {
      logger.error(`Cannot activate PUT season/${seasonId}/deactivate with error ${e}`);
      next(e);
    }
  }

  private async createSeason (req: Request, res: Response, next: NextFunction): Promise<void> {
    const seasonRequest: SeasonRequest = new SeasonRequest(req.body);
    try {
      await this._seasonController.createNewSeason(seasonRequest);
      logger.info(`Success POST season/create`);
      res.status(200).json({});
    } catch (e) {
      logger.error(`Cannot add season POST season/create with error ${e}`);
      next(e);
    }
  }

  private async deleteSeason (req: Request, res: Response, next: NextFunction): Promise<void> {
    const seasonId: string = req.params.id;
    try {
      await this._seasonController.deleteSeason(seasonId);
      logger.info(`Success DELETE season/${seasonId}`);
      res.status(200).json({});
    } catch (e) {
      logger.error(`Cannot DELETE season/${seasonId} with error ${e}`);
      next(e);
    }
  }
}
