import express from 'express';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import responseTime from 'response-time';
import winston from 'winston';
import cors from 'cors';
import logger from './lib/logger';
import settings from './lib/settings';
import security from './lib/security';
import { db } from './lib/mongo';
import dashboardWebSocket from './lib/dashboardWebSocket';
import ajaxRouter from './ajaxRouter';
import apiRouter from './apiRouter';
const app = express();
// app.use(cors());
security.applyMiddleware(app);
app.set('trust proxy', 1);
app.use(helmet());
app.all('*', (req, res, next) => {
	// CORS headers
	res.header('Access-Control-Allow-Origin', '*');
	res.header(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content-Type, Accept'
	);

	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
	next();
});
app.use(responseTime());
app.use(cookieParser(settings.cookieSecretKey));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/ajax', ajaxRouter);
app.use('/api', apiRouter);
app.use(logger.sendResponse);

const server = app.listen(settings.apiListenPort, () => {
	const serverAddress = server.address();
	winston.info(`API running at http://localhost:${serverAddress.port}`);
});

dashboardWebSocket.listen(server);
