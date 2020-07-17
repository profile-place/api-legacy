const express = require('express');
const Loggaby = require('loggaby');
require('dotenv').config();
const api = require('./routers/api');

const app = express();
const logger = new Loggaby();

app.use(express.json());


app.use('/api/v1/', api);

app.listen(4444, () => {
	logger.log('API is online!');
});
