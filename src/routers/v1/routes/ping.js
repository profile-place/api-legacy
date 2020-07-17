function run(req, res) {
	res.status(200).json({ msg: 'pong' });
}

module.exports = {
	run,
	method: 'get'
};
