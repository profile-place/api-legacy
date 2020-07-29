// o yea, ratelimiting this endpoint sounds like a great idea ngl
const argon2 = require('argon2');
const { decode } = require('actual-urlsafe-base64');

async function run(req, res) {
	if (!req.body.email || !req.body.pass) { return res.status(400).json({ success: false }); }

	const email = decode(req.body.email).toLowerCase();
	// if this regex turns out to be broken imma be mad
	if (!/[\w.!#$%&'*+-/=?^`{|}~]{1,64}@[a-z0-9-]{1,255}.[a-z-]{1,64}/.test(email)) {
		return res.status(400).json({
			message: 'invalid email address'
		});
	}

	const exists = await req.app.locals.db.collection('user').findOne({ email: email });
	if (exists) {
		return res.status(400).json({
			message: 'email address already in use'
		});
	}

	const password = await argon2.hash(decode(req.body.pass));

	req.app.locals.db.collection('user').insertOne({
		_id: req.app.locals.snowflakeWorker.generate(),
		email,
		password,
		connections: []
	});

	return res.status(204).send();
}

module.exports = {
	run,
	method: 'post'
};
