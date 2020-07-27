// o yea, ratelimiting this endpoint sounds like a great idea ngl
const argon2 = require('argon2')

const decodeBase64 = text => Buffer.from(text, 'base64').toString('utf-8')

async function run(req, res) {
    if (!req.body.email || !req.body.pass) {
        return res.status(400).json({ "success": false })
    }

    // should verify email and password validity with some sick regex, but we good till this doesnt run in production
    const email = decodeBase64(req.body.email)
    const pass = await argon2.hash(decodeBase64(req.body.pass))
    req.app.locals.db.collection('user').insertOne({
        _id: req.app.locals.snowflakeWorker.generate(),
        email: email,
        password: pass,
        connections: []
    })

    res.status(200).json({ "success": true })
}

module.exports = {
    run,
    method: 'post'
};
