function run(req, res) {
	res.redirect(require('../../../oauth2/discord').authUri);
}

module.exports = {
	run,
	method: 'get'
};
