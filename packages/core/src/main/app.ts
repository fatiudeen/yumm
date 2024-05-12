/* eslint-disable object-curly-newline */
import express, { Application, Request, RequestHandler } from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import morgan from 'morgan';
import hpp from 'hpp';
import helmet from 'helmet';
import xss from 'xss-clean';
import mongoSanitize from 'express-mongo-sanitize';
import compression from 'compression';
import methodOverride from 'method-override';
import { DB } from './data';
import { logger } from '@yumm/utils';
import { errorHandler } from './middlewares';
// import docs from '@middlewares/docs';
// import UsersRoute from '@routes/user.route';
import * as Config from '../config';
// import { rateLimiter } from '@middlewares/rateLimiter';
import Route from './router';
import { BucketService } from '@yumm/helpers';
// import session from 'express-session';
// import visitCount from '@middlewares/visitCount';

// eslint-disable-next-line import/no-extraneous-dependencies, import/no-unresolved
// const MongoDBStore = require('connect-mongodb-session')(session);

export class App {
  private app: Application;
  useSocket = Config.OPTIONS.USE_SOCKETS;
  useAnalytics = Config.OPTIONS.USE_ANALYTICS;
  io?: Server;
  private apiVersion = '/api/v1';
  private routes: Array<Route<any>> = [];
  private middlewares: Array<RequestHandler> = [];

  httpServer;
  constructor({ routes, middlewares }: { routes?: Array<Route<any>>; middlewares?: Array<RequestHandler> } = {}) {
    this.app = express();
    if (this.useSocket) {
      this.httpServer = createServer(this.app);
      this.io = new Server(this.httpServer, {
        cors: {
          origin: '*',
        },
      });
    }
    this.initMiddlewares();
    if (routes) {
      this.routes.push(...routes);
    }

    if (middlewares) {
      this.middlewares.push(...middlewares);
    }
    this.initRoutes();
    this.initErrorHandlers();
  }

  private initRoutes() {
    if (Config.OPTIONS.BUCKET_SERVICE === BucketService.DISK) {
      this.app.use(`${this.apiVersion}/${Config.MULTER_STORAGE_PATH}`, express.static(Config.ROOT_PATH));
    }
    this.routes.forEach((route) => {
      this.app.use(`${this.apiVersion}/${route.path}`, route.initRoutes());
    });
    // this.app.use('/docs', docs);
    this.app.get('/', (req, res) => {
      res
        .status(200)
        .json({ message: 'We both know you are not supposed to be here, but since you are, have a cup of coffee ☕' });
    });

    this.middlewares.forEach((middleware) => {
      this.app.use(middleware);
    });
  }
  private initMiddlewares() {
    this.app.use(
      cors({
        origin: ['*'],
      }),
    );
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(morgan('dev'));
    this.app.use(express.json());
    this.app.use(hpp());
    this.app.use(helmet());
    this.app.use(xss());
    this.app.use(mongoSanitize());
    this.app.use(compression());
    this.app.use(methodOverride());
    // if (Config.NODE_ENV !== 'development') {
    //   this.app.use(`${this.apiVersion}`, rateLimiter);
    // }
    // if (Config.NODE_ENV !== 'test' && this.useAnalytics) {
    //   this.visitCount(Config.DB_URI);
    // }
    if (this.useSocket) {
      this.app.use((req, res, next) => {
        req.io = this.io!;
        next();
      });
    }
  }

  private initErrorHandlers() {
    this.app.use(errorHandler);
    this.app.use('*', (req, res) => {
      res.status(404).json({ msg: 'Route not found' });
    });
  }

  // private visitCount(connectionString: string) {
  //   const Session: session.SessionOptions = {
  //     secret: Config.JWT_KEY,
  //     resave: false,
  //     store: new MongoDBStore({
  //       uri: connectionString,
  //       collection: 'cookie_sessions',
  //     }),
  //     rolling: true,
  //     saveUninitialized: true,
  //     cookie: {
  //       // path: '/',
  //       httpOnly: false,
  //       sameSite: 'none',
  //       secure: false,
  //       // maxAge: 1000 * 60 * 5, // one minuit
  //     },
  //   };
  // this.app.use(session(Session));
  // this.app.use(visitCount());
  // }

  public listen(port: number, connectionString: string) {
    const server = this.useSocket ? this.httpServer! : this.app;

    DB(connectionString);
    server.listen(port, () => {
      logger.info(`running on port ${port}`);
    });
  }

  public instance() {
    return this.app;
  }
}
