import express from 'express';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import responseTime from 'response-time';
import winston from 'winston';
import logger from './lib/logger';
import settings from './lib/settings';
import security from './lib/security';
import dashboardWebSocket from './lib/dashboardWebSocket';
import ajaxRouter from './ajaxRouter';
import apiRouter from './apiRouter';
import ProductService from './services/products/products';
import ProductImagesService from './services/products/images';
import ProductCategories from './services/products/productCategories';
import Axios from 'axios';
import FormData from 'form-data';

const app = express();
security.applyMiddleware(app);
app.set('trust proxy', 1);
app.use(helmet());
// Enable CORS
app.use(function(req, res, next) {
	res.header('Access-Control-Allow-Origin', req.headers.origin);
	res.header(
		'Access-Control-Allow-Headers',
		'"Origin, X-Requested-With, Content-Type, Accept, Authorization'
	);
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
	res.header('Access-Control-Allow-Credentials', 'true');
	res.header('Access-Control-Max-Age', '1000000000');
	// intercept OPTIONS method
	if ('OPTIONS' == req.method) {
		res.send(200);
	} else {
		next();
	}
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
	Axios.get(
		'https://cryptomining.tools/compare-mining-hardware/xhr/all_miners.json'
	).then(async ({ data }) => {
		const categories = await ProductCategories.getCategories();

		data.map(product => {
			const attributes = [];
			Object.keys(product).map(item => {
				if (
					item !== 'name' ||
					item !== 'regular_price' ||
					item !== 'logo_url' ||
					item !== 'miner_image_url' ||
					item !== 'weight'
				)
					attributes.push({
						name: item,
						value: product[item]
					});
			});
			const body = {
				name: product.m_name,
				regular_price: product.price,
				logo_url: product.logo_url,
				miner_image_url: product.miner_image_url,
				weight: parseInt(product.weight) / 1000,
				stock_quantity: 1,
				category_id: categories[0].id,
				attributes
			};
			ProductService.addProduct(body).then(res => {
				ProductImagesService.addImageFromUrl(product.miner_image_url, res.id);
			});
		});
	});
});

dashboardWebSocket.listen(server);
