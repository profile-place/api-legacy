const express = require('express');
const Loggaby = require('loggaby');
const cookieParser = require('cookie-parser');
const snowflakey = require('snowflakey');
const RedisClient = require('ioredis');
const { MongoClient } = require('mongodb');
const { constants } = require('../lib/util');
const logger = new Loggaby();
const cors = require('cors');

require('dotenv').config();

const port = parseInt(process.env.API_PORT || 3307);
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors());

MongoClient.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017', { useUnifiedTopology: true, useNewUrlParser: true }, (err, client) => {
	if (err) {
		logger.error(`mongo connection failed: ${err}`);
		process.exit();
	}
	logger.log('connected to database');
	app.locals.db = client.db('profileplace');
});

app.locals.snowflakeWorker = new snowflakey.Worker({
	epoch: constants.epoch,
	workerId: 28,
	processId: process.pid,
	workerBits: 8,
	processBits: 0,
	incrementBits: 14
});

app.locals.redis = new RedisClient({
	host: process.env.REDIS_HOST || 'localhost',
	port: Number(process.env.REDIS_PORT) || 6379,
	password: process.env.REDIS_PASSWORD,
	db: Number(process.env.REDIS_DATABASE) || 9,
	lazyConnect: true
});

app.locals.redis.once('ready', () => logger.log('connected to redis'));

const { readdir } = require('fs').promises;
const { join } = require('path').posix;

readdir(join(__dirname, 'routers')).then(async versions => {
	for (const version of versions) {
		const router = require(`./routers/${version}`);
		app.use(`/api/${version}/`, await router());
	}

	// Handle routes that dont exist
	app.use((req, res) => {
		res.status(404).json({ msg: 'Not found' });
	});

	// Handle unexpected errors
	app.use((err, req, res) => {
		res.status(500).json({ msg: 'An unexpected error occurred. Please try again later.' });
		console.error(`500 at ${req.path}: ${err}`);
	});

	app.listen(port, async () => {
		try {
			await app.locals.redis.connect();
		} catch (ex) {
			logger.error(`unable to connect to redis:\n${ex}`);
			process.exit();
		}

		logger.log(`API listening on port ${port}`);
		logger.log(`Versions loaded: ${versions.join(', ')}`);
	});
});
