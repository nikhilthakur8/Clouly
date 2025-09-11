const jwt = require("jsonwebtoken");

const generateToken = (payload, expiresIn) => {
	return jwt.sign(payload, process.env.JWT_SECRET, {
		expiresIn: expiresIn || "7d",
	});
};
const verifyToken = (token) => {
	return jwt.verify(token, process.env.JWT_SECRET);
};
module.exports = { generateToken, verifyToken };
