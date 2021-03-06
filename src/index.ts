import * as config from 'config';
import { Server } from './server';

// start the server
export const app = Server.bootstrap().app;
export const server = app.listen(config.get('port'));
