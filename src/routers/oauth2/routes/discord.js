const baseURL = 'https://discord.com/api/oauth2/';

module.exports = {
	run: (req, res) => {
		const url = new URL('authorize', baseURL);
		url.search = new URLSearchParams({
			client_id: process.env.DISCORD_ID,
			redirect_uri: process.env.DISCORD_REDIRECT_URI,
			response_type: 'code',
			scope: 'identify'
		});
		res.redirect(url.href);
	},
	method: 'get'
};
