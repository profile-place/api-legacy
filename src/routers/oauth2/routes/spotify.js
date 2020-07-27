const baseURL = 'https://accounts.spotify.com/';

module.exports = {
	run: (req, res) => {
		const url = new URL('authorize', baseURL);
		url.search = new URLSearchParams({
			response_type: 'code',
			client_id: process.env.SPOTIFY_ID,
			redirect_uri: process.env.SPOTIFY_REDIRECT_URI
		});
		res.redirect(url.href);
	},
	method: 'get'
};
