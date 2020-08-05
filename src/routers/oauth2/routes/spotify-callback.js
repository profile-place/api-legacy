const centra = require('@aero/centra');
const { getTokenOwner } = require('../../../../lib/util');

module.exports = {
	run: async (req, res) => {
		const tokens = await centra('https://accounts.spotify.com/api/token', 'POST')
			.body({
				grant_type: 'authorization_code',
				code: req.query.code,
				redirect_uri: process.env.SPOTIFY_REDIRECT_URI
			}, 'form')
			.header('Authorization', `Basic ${Buffer.from(`${process.env.SPOTIFY_ID}:${process.env.SPOTIFY_SECRET}`).toString('base64')}`)
			.json();

		let user = await centra('https://api.spotify.com/v1/me')
			.header('Authorization', `Bearer ${tokens.access_token}`)
			.json();

		if (user.error) { return res.status(401).send(); }

		user = Object.assign(user, {
			_owner: getTokenOwner(req.cookies.access_token),
			_id: `spotify:${user.id}`
		});

		// if anyone can improve this query, contact Cyber
		const found = await req.app.locals.db.collection('connection').findOne({ _id: user._id });
		if (!found) {
			req.app.locals.db.collection('connection').insertOne(user);
		} else {
			req.app.locals.db.collection('connection').findOneAndUpdate({ _id: user._id }, { $set: user });
		}

		return res.status(200).json(user);
	},
	method: 'get'
};
