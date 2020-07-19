// i hate eslint so much -Cyber
// same -sammy
/* eslint-disable camelcase */
const centra = require('@aero/centra');

module.exports = {
	name: 'discord',
	authUri: `https://discord.com/api/oauth2/authorize?client_id=${process.env.DISCORD_ID}&redirect_uri=${encodeURIComponent(process.env.DISCORD_REDIRECT_URI)}&response_type=code&scope=identify`,
	callback: async (req, res) => {
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

		const user = await centra('https://discord.com/api/users/@me')
			.header('Authorization', `Bearer ${tokens.access_token}`)
			.json();

		res.status(200).json({ ...user });
	}
};
