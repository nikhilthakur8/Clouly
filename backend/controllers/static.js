const Subdomain = require("../models/Subdomain");

const handleCheckSubdomainAvailability = async (req, res) => {
	try {
		const name = req.query.name.trim().toLowerCase();
		if (!name || !/^[a-z0-9-]+$/.test(name)) {
			return res.status(400).send({
				message: "Subdomain is Invalid",
				error: "Bad Request",
			});
		}
		const isSubdomainExist = await Subdomain.exists({
			name: name.toLowerCase(),
		});

		if (isSubdomainExist) {
			return res.status(200).send({
				message: "Subdomain is not available",
				available: !isSubdomainExist,
			});
		} else {
			return res.status(200).send({
				message: "Subdomain is available",
				available: true,
			});
		}
	} catch (error) {
		return res
			.status(500)
			.send({ message: "Internal server error", error: "Server Error" });
	}
};

module.exports = { handleCheckSubdomainAvailability };
