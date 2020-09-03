const { decode } = require('actual-urlsafe-base64');

module.exports = {
	method: 'get',
	async run(req, res) {
		if (!req.query.email) return res.status(500).json({ message: 'Missing ?email query' });

		const email = decode(req.query.email);
		const user = await req.app.locals.db.collection('user').findOne({ email: email });
		if (!user) { return res.status(400).json({ message: 'email address doesn\'t exist' }); }

		return res.status(200).json({
			// look this looks wrong but idc
			connections: user.connections.map(connection => (() => {
				const [type, id] = connection._id.split(':');
				return {
					type,
					id
				};
			})()),
			email,
			id: user._id
		});
	}
};
