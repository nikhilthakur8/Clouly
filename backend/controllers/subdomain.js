const SubDomain = require("../models/Subdomain");
const DNSRecord = require("../models/DNSRecord");
const cfApiService = require("../service/cfConfig");

const handleCreateSubdomain = async (req, res) => {
	try {
		const { name, notes } = req.body;

		const isSubdomainExist = await SubDomain.findOne({ name });

		if (isSubdomainExist) {
			return res.status(409).send({
				message: "Subdomain already exists",
				error: "Conflict",
			});
		}

		const subdomain = await SubDomain.create({
			name,
			notes,
			ownerUserId: req.user._id,
		});

		return res.status(201).send({
			message: "Subdomain created successfully",
			data: subdomain,
		});
	} catch (error) {
		return res
			.status(500)
			.send({ message: "Internal server error", error: "Server Error" });
	}
};

const handleGetSubdomain = async (req, res) => {
	try {
		const { subdomainId } = req.params;
		const { _id: ownerUserId } = req.user;

		const subdomain = await SubDomain.findOne({
			_id: subdomainId,
			ownerUserId,
		});

		if (!subdomain) {
			return res.status(404).send({
				message: "Subdomain not found",
				error: "Not Found",
			});
		}

		return res.status(200).send({
			message: "Subdomain retrieved successfully",
			data: subdomain,
		});
	} catch (error) {
		return res
			.status(500)
			.send({ message: "Internal server error", error: "Server Error" });
	}
};

const handleGetAllSubdomains = async (req, res) => {
	try {
		const { _id: ownerUserId } = req.user;
		const subdomains = await SubDomain.find({ ownerUserId });
		return res.status(200).send({
			message: "Subdomains retrieved successfully",
			data: subdomains,
		});
	} catch (error) {
		return res
			.status(500)
			.send({ message: "Internal server error", error: "Server Error" });
	}
};

// we will implement it later because it requires cascading delete of dns records
const handleDeleteSubdomain = async (req, res) => {
	try {
		const { subdomainId } = req.params;
		const { _id: ownerUserId } = req.user;
		const subdomain = await SubDomain.findOneAndDelete({
			_id: subdomainId,
			ownerUserId,
		});
		if (!subdomain) {
			return res.status(404).send({
				message: "Subdomain not found",
				error: "Not Found",
			});
		}

		const dnsRecords = await DNSRecord.find({
			subdomain: subdomainId,
		}).select("cfId");

		const dnsRecordIds = dnsRecords.map((record) => {
			return { id: record.cfId };
		});
		if (dnsRecordIds.length > 0) {
			await cfApiService.post("/dns_records/batch", {
				deletes: dnsRecordIds,
			});

			await DNSRecord.deleteMany({ subdomain: subdomainId });
		}
		return res.status(200).send({
			message: "Subdomain deleted successfully",
			data: subdomain,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).send({
			message: "Internal server error",
			error: error.response.data,
		});
	}
};

module.exports = {
	handleCreateSubdomain,
	handleGetSubdomain,
	handleGetAllSubdomains,
	handleDeleteSubdomain,
};
