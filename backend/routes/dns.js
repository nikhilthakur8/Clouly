const {
	authenticateSubdomainOwnership,
} = require("../middleware/authenticate");
const { validateBody } = require("../middleware/validateBody");
const { dnsRecordZodSchema } = require("../validations/dnsRecordSchema");
const subdomainRouter = require("express").Router();
const { subdomainZodSchema } = require("../validations/subDomainSchema");
const {
	handleCreateSubdomain,
	handleDeleteSubdomain,
	handleGetAllSubdomains,
	handleGetSubdomain,
} = require("../controllers/subdomain");
const {
	handleCreateDNSRecord,
	handleDeleteDNSRecord,
	handleGetAllDNSRecords,
	handleUpdateDNSRecord,
	handleGetDNSRecord,
} = require("../controllers/dns");

subdomainRouter.post(
	"/",
	validateBody(subdomainZodSchema),
	handleCreateSubdomain
);
subdomainRouter.get("/", handleGetAllSubdomains);
subdomainRouter.get("/:subdomainId", handleGetSubdomain);
subdomainRouter.delete("/:subdomainId", handleDeleteSubdomain);

subdomainRouter.post(
	"/:subdomainId/dns",
	authenticateSubdomainOwnership,
	validateBody(dnsRecordZodSchema),
	handleCreateDNSRecord
);

subdomainRouter.get(
	"/:subdomainId/dns",
	authenticateSubdomainOwnership,
	handleGetAllDNSRecords
);

subdomainRouter.put(
	"/:subdomainId/dns/:dnsRecordId",
	authenticateSubdomainOwnership,
	validateBody(dnsRecordZodSchema),
	handleUpdateDNSRecord
);

subdomainRouter.get(
	"/:subdomainId/dns/:dnsRecordId",
	authenticateSubdomainOwnership,
	handleGetDNSRecord
);

subdomainRouter.delete(
	"/:subdomainId/dns/:dnsRecordId",
	authenticateSubdomainOwnership,
	handleDeleteDNSRecord
);

module.exports = subdomainRouter;
