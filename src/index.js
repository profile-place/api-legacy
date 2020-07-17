const express = require('express');
const Loggaby = require('loggaby');
const logger = new Loggaby();
require('dotenv').config();
const port = parseInt(process.env.API_PORT);

const app = express();
app.use(express.json());

const { readdir } = require('fs').promises;
const { join } = require('path').posix;

// Handle errors (not found, whatever)
app.use((req, res) => {
	res.status(404).json({
		message: "Not found"
	});
});

readdir(join(__dirname, 'routers')).then(async versions => {
	for (const version of versions) {
		const router = require(`./routers/${version}`);
		app.use(`/api/${version}/`, await router());
	}
	app.listen(port, () => {
		logger.log(`API listening on port ${port}`);
		logger.log(`Versions loaded: ${versions.join(', ')}`);
	});
});
