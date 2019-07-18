import winston from 'winston';
import url from 'url';
import { MongoClient } from 'mongodb';
import settings from './settings';
import ProductService from '../services/products/products';
import ProductImagesService from '../services/products/images';
import ProductCategories from '../services/products/productCategories';

import Axios from 'axios';

const mongodbConnection = settings.mongodbServerUrl;
const mongoPathName = url.parse(mongodbConnection).pathname;
const dbName = mongoPathName.substring(mongoPathName.lastIndexOf('/') + 1);

const RECONNECT_INTERVAL = 1000;
const CONNECT_OPTIONS = {
	reconnectTries: 3600,
	reconnectInterval: RECONNECT_INTERVAL,
	useNewUrlParser: true
};

const onClose = () => {
	winston.info('MongoDB connection was closed');
};

const onReconnect = () => {
	winston.info('MongoDB reconnected');
};

const runCronJob = async () => {
	Axios.get(
		'https://cryptomining.tools/compare-mining-hardware/xhr/all_miners.json'
	).then(async ({ data }) => {
		const categories = await ProductCategories.getCategories();

		data.map(async product => {
			const attributes = [];
			let matchedProduct = {};
			matchedProduct = await db.collection('products').findOne({
				attributes: {
					$elemMatch: {
						name: 'id',
						value: product.id.toString()
					}
				}
			});
			if (!matchedProduct || Object.keys(matchedProduct).length <= 0) {
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
					regular_price: 1000,
					category_id: categories[0].id,
					attributes
				};
				ProductService.addProduct(body).then(res => {
					ProductImagesService.addImageFromUrl(product.miner_image_url, res.id);
				});
			}
		});
	});
};

export let db = null;

const connectWithRetry = () => {
	MongoClient.connect(
		mongodbConnection,
		CONNECT_OPTIONS,
		(err, client) => {
			if (err) {
				winston.error(
					`MongoDB connection was failed: ${err.message}`,
					err.message
				);
				setTimeout(connectWithRetry, RECONNECT_INTERVAL);
			} else {
				db = client.db(dbName);
				db.on('close', onClose);
				db.on('reconnect', onReconnect);
				winston.info('MongoDB connected successfully');
				runCronJob();
			}
		}
	);
};

connectWithRetry();
