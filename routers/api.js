const express = require('express');
// eslint-disable-line new-cap
const api = express.Router();

api.get('/', (req, res) => {
	res.status(201).json({ msg: 'Hello World!' });
});

module.exports = api;
