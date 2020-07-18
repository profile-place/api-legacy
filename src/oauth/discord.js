// i hate eslint so much -Cyber
/* eslint-disable camelcase */
const axios = require('axios');
const qs = require('querystring');

module.exports = {
	name: 'discord',
	authUri: `https://discord.com/api/oauth2/authorize?client_id=${process.env.DISCORD_ID}&redirect_uri=${encodeURIComponent(process.env.DISCORD_REDIRECT_URI)}&response_type=code&scope=identify`,
	callback: async (req, res) => {
		const tokens = await axios({
			method: 'post',
			url: 'https://discord.com/api/oauth2/token',
			data: qs.encode({
				client_id: process.env.DISCORD_ID,
				client_secret: process.env.DISCORD_SECRET,
				grant_type: 'authorization_code',
				code: req.query.code,
				redirect_uri: process.env.DISCORD_REDIRECT_URI,
				scope: 'identify connections'
			}),
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			}
		});
		const user = await axios({
			method: 'get',
			url: 'https://discord.com/api/users/@me',
			headers: { Authorization: `Bearer ${tokens.data.access_token}` }
		});
		res.status(200).json({ msg: `Hello ${user.data.username}` });
	}
};
