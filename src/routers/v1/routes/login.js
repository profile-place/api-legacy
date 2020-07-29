const argon2 = require('argon2');
const { encode, decode } = require('actual-urlsafe-base64');
const { constants, generateSecret } = require('../../../../lib/util');

async function run(req, res) {
	if (!req.body.email || !req.body.pass) { return res.status(400).json({ success: false }); }

	const email = decode(req.body.email).toLowerCase();

	const user = await req.app.locals.db.collection('user').findOne({ email: email });
	const match = await argon2.verify(user.password, decode(req.body.pass));

	if (!user) { return res.status(400).json({ message: 'email address doesn\'t exist' }); }
	if (!match) { return res.status(401).send(); }

	const token = {
		_id: generateSecret(),
		owner: user._id,
		type: 0,
		timestamp: new Date().getTime() - constants.epoch
	};

	// not saving it to db yet, refer to #api

	return res.status(200).json({
		token: `${encode(token.owner)}.${encode(token.timestamp.toString())}.${encode(token._id)}`,
		type: 'Bearer'
	});
}

module.exports = {
	run,
	method: 'post'
};
