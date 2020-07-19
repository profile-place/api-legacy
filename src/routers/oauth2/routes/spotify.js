function run(req, res) {
	res.redirect(require('../../../oauth2/spotify').authUri);
}

module.exports = {
	run,
	method: 'get'
};
