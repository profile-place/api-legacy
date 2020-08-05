const centra = require('@aero/centra');
const { getTokenOwner } = require('../../../../lib/util');

module.exports = {
	run: async (req, res) => {
		if (!req.cookies.access_token) { return res.status(400).send(); }
		console.log(req.app.locals.redis.get(req.cookies.access_token));
		// should check if the token is valid in the first place
		const tokens = await centra('https://discord.com/api/oauth2/token', 'POST')
			.body({
				client_id: process.env.DISCORD_ID,
				client_secret: process.env.DISCORD_SECRET,
				grant_type: 'authorization_code',
				code: req.query.code,
				redirect_uri: process.env.DISCORD_REDIRECT_URI,
				scope: 'identify connections'
			}, 'form')
			.json();

		let user = await centra('https://discord.com/api/users/@me')
			.header('Authorization', `Bearer ${tokens.access_token}`)
			.json();

		if (user.message === '401: Unauthorized') { return res.status(401).send(); }

		user = Object.assign(user, {
			_owner: getTokenOwner(req.cookies.access_token),
			_id: `discord:${user.id}`
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
