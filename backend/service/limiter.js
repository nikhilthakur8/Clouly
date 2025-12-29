const rateLimit = require("express-rate-limit");

const normalLimiter = rateLimit({
	windowMs: 60 * 1000,
	max: 60,
	handler: (req, res, next) => {
		res.status(429).json({
			error: "Rate limit exceeded",
			message: "You have sent too many requests. Try again later.",
		});
	},
});

const dnsWriteLimiter = rateLimit({
	windowMs: 60 * 1000,
	max: 10,
	keyGenerator: (req) => {
		console.log(req.user._id.toString());
		return req.user._id.toString() || rateLimit.ipKeyGenerator(req);
	},
	handler: (req, res, next) => {
		res.status(429).json({
			error: "Rate limit exceeded",
			message: "You have sent too many requests. Try again later.",
		});
	},
	standardHeaders: true,
	legacyHeaders: false,
});

module.exports = {
	normalLimiter,
	dnsWriteLimiter,
};
