const express = require('express');
const Loggaby = require('loggaby');
require('dotenv').config()

const app = express();
const logger = new Loggaby();

app.listen(4444, () => {
	logger.log('API is online!');
});
