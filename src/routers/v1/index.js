const { recurseDir } = require('../../../lib/util');
const { join } = require('path').posix;

const express = require('express');
/* eslint-disable-next-line new-cap */
const api = express.Router();

module.exports = async () => {
	const routes = await recurseDir(join(__dirname, 'routes'));
	for (const routeName of routes) {
		const route = require(`./routes/${routeName}`);
		api[route.method](`/${routeName}`, route.run);
	}

	return api;
};
