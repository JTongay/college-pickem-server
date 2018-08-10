import { Season, SeasonRequest } from '@/models';

export interface ISeasonController {
  getAllSeasons (): Promise<Season[]>;
  getActiveSeason (league: string): Promise<Season>;
  getSeasonById (id: string): Promise<Season>;
  createNewSeason (season: SeasonRequest): Promise<Season>;
  toggleSeason (id: string, active: boolean): Promise<void>;
  deleteSeason (id: string): Promise<void>;
  checkForActiveSeason (league: string): Promise<boolean>;
}
