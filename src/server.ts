import * as express from 'express';
import * as cron from 'cron';
import * as ejs from 'ejs';
import { Transporter } from 'nodemailer';
import { Moment }  from 'moment';
import * as fs from 'fs';
import * as path from 'path';
import * as morgan from 'morgan';
import * as expressStatusMonitor from 'express-status-monitor';
import * as helmet from 'helmet';
import * as errorHandler from 'errorhandler';
import * as bodyParser from 'body-parser';

const app: express.Express = express();
const port = process.env.PORT || 3000;
const environment = process.env.NODE_ENV || 'development';
// const collegeCrawler = require('./college-crawler');
// const insertTeams = require('./scripts/insertTeams');
// const insertMatchups = require('./scripts/insertMatchups');
// const knex = require('./db/conf');
require('dotenv').config();

import { logger } from './services';
import { ApiRoutes } from '@/routes';

// Middleware
// const bodyParser = require('body-parser');

// Routes
// const football = require('./routes/football');
// const users = require('./routes/users');
// const session = require('./routes/sessions');
// const season = require('./routes/seasons');
// const matchups = require('./routes/matchups');
// const scores = require('./routes/scores');
// const picks = require('./routes/picks');

/**
 * The main server class
 *
 * @class Server
 */
export class Server {

  public app: express.Application;

  /**
   * Constructor
   * @class Server
   * @constructor
   */
  constructor () {
    // creates the application
    this.app = express();
    // configure application
    this.config();
    // add routes
    this.routes();
  }

  /**
   * Bootstrap the application
   *
   * @class Server
   * @method bootstrap
   * @static
   */
  public static bootstrap (): Server {
    return new Server();
  }

  public config (): void {
    // adds static assets path
    this.app.use(express.static(path.join(__dirname, 'public')));
    // adds morgan logging
    this.app.use(morgan('tiny', {
      stream: {
        write: (message: string) => logger.info(message.trim())
      }
    } as morgan.Options));
    // mounts json form parser
    this.app.use(bodyParser.json({ limit: '50mb' }));
    // mount query string parser
    this.app.use(bodyParser.urlencoded({
      extended: true,
    }));
    this.app.use(helmet());
    this.app.use(expressStatusMonitor());

    // accept everything for now
    this.app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
      next();
    });

    // catch 404 and forward to error handler
    this.app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
      err.status = 404;
      next(err);
    });

    // error handling
    this.app.use(errorHandler());
  }

  /**
   * Create and return Router.
   *
   * @class Server
   * @method routes
   * @return void
   */
  private routes (): void {
    // use router middleware
    this.app.use(ApiRoutes.path, ApiRoutes.router);
  }
}

// Use Routes
// app.use('/api', football);
// app.use('/api/users', users);
// app.use('/api/users/:user_id/seasons/:season_id/picks', picks);
// app.use('/api/session', session);
// app.use('/api/season', season);
// app.use('/api/season/:season_id/score', scores);
// app.use('/api/season/:season_id/matchup', matchups);

// Start the server
// app.listen(port, () => {
//   console.log('Hello from port ', port); //eslint-disable-line
//   console.log('Starting in mode ', environment); //eslint-disable-line
// });


// module.exports = app;
