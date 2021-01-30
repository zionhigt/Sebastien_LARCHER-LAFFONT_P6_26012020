const limiter = require('express-rate-limit');

module.exports = limiter({
	windowMs: 15 * 60 * 1000,
	max: 10,
	message: "Too many request has benn sent, please try again after a couple of time"
});