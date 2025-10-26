const staticRouter = require("express").Router();
const { handleCheckSubdomainAvailability } = require("../controllers/static");
staticRouter.get(
	"/check-subdomain-availability",
	handleCheckSubdomainAvailability
);

module.exports = staticRouter;
