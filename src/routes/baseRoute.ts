import { Router } from 'express';

export abstract class BaseRoute {

  protected router = Router({ mergeParams: true });

}
