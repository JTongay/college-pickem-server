import { Season } from '@/models';

export interface ISeasonController {
  getAllSeasons (): Promise<Season[]>;
}
