const express = require('express');
const Loggaby = require('loggaby');
const logger = new Loggaby();
require('dotenv').config();
const port = parseInt(process.env.API_PORT);

const app = express();
app.use(express.json());

const { readdir } = require('fs').promises;
const { join } = require('path').posix;

// this should use the same readdir code but this works
app.get('/dccb', require('./oauth/discord').callback);

readdir(join(__dirname, 'routers')).then(async versions => {
	for (const version of versions) {
		const router = require(`./routers/${version}`);
		app.use(`/api/${version}/`, await router());
	}
	app.listen(port, () => {
		logger.log(`API listening on port ${port}`);
		logger.log(`Versions loaded: ${versions.join(', ')}`);
	});

	// Handle errors (not found, whatever)
	app.use((req, res) => {
		res.status(404).json({ msg: 'Not found', info: 'Couldn\'t find that page. Try again later.' });
	});

	// u guys decide what u want to do with the error (say log only if a certain message code whatever the fuck)
	/* eslint-disable-next-line handle-callback-err */
	app.use((err, req, res) => {
		res.status(500).json({ msg: 'Something went wrong.', info: 'An error occurred. Try again later.' });
	});
});

