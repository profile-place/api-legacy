// o yea, ratelimiting this endpoint sounds like a great idea ngl
const argon2 = require('argon2');
const b64 = require('actual-urlsafe-base64');

async function run(req, res) {
	if (!req.body.email || !req.body.pass) { return res.status(400).json({ success: false }); }

	// should verify email and password validity with some sick regex, but we good till this doesnt run in production
	const email = b64.decode(req.body.email).toLowerCase();
	if (!/[\w.!#$%&'*+-/=?^`{|}~]{1,64}@[a-z0-9\-]{1,255}.[a-z\-]{1,64}/.test(email)) return res.status(400).json({
		message: 'invalid email address'
	});

	const pass = await argon2.hash(b64.decode(req.body.pass));

	req.app.locals.db.collection('user').insertOne({
		_id: req.app.locals.snowflakeWorker.generate(),
		email: email,
		password: pass,
		connections: []
	});

	return res.status(204).send();
}

module.exports = {
	run,
	method: 'post'
};
