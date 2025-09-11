const Subdomain = require("../models/Subdomain");
const User = require("../models/User");
const { verifyToken } = require("../utils/jwt");
const authenticate = async (req, res, next) => {
	try {
		const authHeader = req.headers.authorization;
		const token = authHeader && authHeader.split(" ")[1];
		if (!token) {
			return res
				.status(401)
				.send({ message: "No token provided", error: "Unauthorized" });
		}

		const tokenData = verifyToken(token);
		if (!tokenData) {
			return res
				.status(401)
				.send({ message: "Invalid token", error: "Unauthorized" });
		}
		const user = await User.findById(tokenData.id).lean();
		if (!user) {
			return res
				.status(404)
				.send({ message: "User not found", error: "Not Found" });
		}
		req.user = user;
		next();
	} catch (error) {
		console.log(error);
		return res
			.status(500)
			.send({ message: "Internal server error", error: "Server Error" });
	}
};

const authenticateSubdomainOwnership = async (req, res, next) => {
	const subdomainId = req.params.subdomainId;
	const { _id: ownerUserId } = req.user;
	const subdomain = await Subdomain.findOne({
		_id: subdomainId,
		ownerUserId,
	});
	if (!subdomain) {
		return res.status(404).send({
			message: "Subdomain not found",
			error: "Not Found",
		});
	}
	req.subdomain = subdomain;
	next();
};

module.exports = { authenticate, authenticateSubdomainOwnership };
