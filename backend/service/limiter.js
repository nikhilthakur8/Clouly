const rateLimit = require("express-rate-limit");

const loginLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 5,
	handler: (req, res, next) => {
		res.status(429).json({
			error: "Rate limit exceeded",
			message: "You have sent too many requests. Try again later.",
		});
	},
});

const normalLimiter = rateLimit({
	windowMs: 60 * 1000,
	max: 100,
	handler: (req, res, next) => {
		res.status(429).json({
			error: "Rate limit exceeded",
			message: "You have sent too many requests. Try again later.",
		});
	},
});

const dnsLimiter = rateLimit({
	windowMs: 10 * 60 * 1000,
	max: 10,
	handler: (req, res, next) => {
		res.status(429).json({
			error: "Rate limit exceeded",
			message: "You have sent too many requests. Try again later.",
		});
	},
});

module.exports = {
	loginLimiter,
	normalLimiter,
	dnsLimiter,
};
