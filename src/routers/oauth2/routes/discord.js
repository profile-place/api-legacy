module.exports = {
	run: (req, res) =>
		res.redirect(`https://discord.com/api/oauth2/authorize?client_id=${process.env.DISCORD_ID}&redirect_uri=${encodeURIComponent(process.env.DISCORD_REDIRECT_URI)}&response_type=code&scope=identify`),
	method: 'get'
};
