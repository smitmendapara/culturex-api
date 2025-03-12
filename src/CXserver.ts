
import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// * utils
import { viewJSONResponse } from './utils/CXcommon.utils';
import _constantUtil from './utils/CXconstant.utils';
import _loggerUtil from './utils/CXlogger.utils';

dotenv.config();

// * web routes
// import webAuthenticationRoutes from './routes/CXauthentication.routes';
import webMediaRoutes from './routes/CXmedia.routes';

// * destructure constants
const {
    MEDIA,
    STATUS_200,
    DEFAULT_PORT,
    SERVER_STATUS,
    ONE_THOUSAND,
    WEB_API_PREFIX,
    DB_CONNECTED,
    AUTHENTICATION,
    SERVER_STARTED,
    DB_NOT_CONNECTED,
    HIGH_PRIORITY_LOG,
    BOOLEAN_TRUE: trueValue,
    BOOLEAN_FALSE: falseValue,
    EMPTY_STRING: emptyValue
} = _constantUtil;

const {
    PORT,
    DB_URL,
    LIVE_SERVER,
    LOCAL_VM_1
} = process.env;

class AppServer {
    private app: Application;
    private port: string | number;
    private webApiPrefix: string;
    private version: string;
    private dbUrl: string;
    private allowedOrigins: string[];

    constructor() {
        this.version = '/v1/';
        this.app = express();
        this.port = PORT || DEFAULT_PORT;
        this.webApiPrefix = WEB_API_PREFIX;
        this.dbUrl = DB_URL || emptyValue;

        // * allowed origins
        this.allowedOrigins = [
            LIVE_SERVER || emptyValue,
            LOCAL_VM_1 || emptyValue
        ];

        // * initialize middlewares
        this.initializeMiddlewares();

        // * initialize routes
        this.initializeRoutes();

        // * connect to database
        this.connectDatabase();
    }

    // * initialize middlewares
    private initializeMiddlewares(): void {
        this.app.use(cors({
            origin: this.allowedOrigins
        }));

        this.app.use(express.json());
    }

    // * initialize routes
    private initializeRoutes(): void {
        // this.app.use(this.webApiPrefix + this.version + AUTHENTICATION, webAuthenticationRoutes);
        this.app.use(this.webApiPrefix + this.version + MEDIA, webMediaRoutes);

        // * health check route
        this.app.get(this.webApiPrefix + '/health', (req: Request, res: Response) => {
            const uptimeInSeconds = process.uptime();
            const serverStartTime = new Date(Date.now() - (uptimeInSeconds * ONE_THOUSAND));
            const currentServerTime = new Date();
            const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

            // * api response
            viewJSONResponse(res, trueValue, STATUS_200, SERVER_STATUS, {
                uptime: uptimeInSeconds,
                server_start_time: serverStartTime.toLocaleString(),
                current_server_time: currentServerTime.toLocaleString(),
                timezone
            });
        });
    }

    // * connect to database
    private connectDatabase(): void {
        mongoose.set('strictQuery', falseValue);
        mongoose.connect(this.dbUrl)
            .then(() => {
                _loggerUtil.info(DB_CONNECTED);

                // * start server
                this.startServer();

            }).catch((error: any) => {
                _loggerUtil.error(DB_NOT_CONNECTED + error, {
                    priority: HIGH_PRIORITY_LOG
                });
            });
    }

    // * start server
    private startServer(): void {
        this.app.listen(this.port, () => {
            _loggerUtil.info(SERVER_STARTED + this.port);
        });
    }
}

// * app server
new AppServer();