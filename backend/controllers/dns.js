const DNSRecord = require("../models/DNSRecord");
const Record = require("../models/Record");
const handleCreateDNSRecord = async (req, res) => {
	try {
		const { type, content, ttl } = req.body;
		const ownerUserId = req.user._id;
		const { name, _id: subdomainId } = req.subdomain;

		const existingCNAME = await DNSRecord.findOne({
			name,
			subdomain: subdomainId,
			type: "CNAME",
		});

		if (type === "CNAME") {
			const existingAny = await DNSRecord.findOne({
				name,
				subdomain: subdomainId,
				type: ["AAAA", "A"],
			});

			if (existingAny) {
				return res.status(400).send({
					message:
						"CNAME record cannot coexist with other records on the same name",
					error: "Bad Request",
				});
			}
		} else {
			if (existingCNAME && (type === "A" || type === "AAAA")) {
				return res.status(400).send({
					message: `${type} record cannot be created because a CNAME already exists for this name`,
					error: "Bad Request",
				});
			}

			const existingRecord = await DNSRecord.findOne({
				name,
				type,
				content,
				subdomain: subdomainId,
			});

			if (existingRecord) {
				return res.status(400).send({
					message: `${type} record with this content already exists`,
					error: "Bad Request",
				});
			}
		}

		const extDnsRecord = await Record.create({
			type,
			name,
			content,
			ttl,
			zone: process.env.EXT_ZONE,
		});

		const dnsRecord = await DNSRecord.create({
			subdomain: subdomainId,
			extRecordId: extDnsRecord._id,
			ownerUserId,
			type,
			name,
			content,
			ttl,
		});

		return res.status(201).send({
			message: "DNS Record created successfully",
			data: dnsRecord,
		});
	} catch (error) {
		console.log(error.response?.data?.errors || error.message);
		return res.status(500).send({
			message: "Internal server error",
			error: error.message,
		});
	}
};

const handleGetAllDNSRecords = async (req, res) => {
	try {
		const subdomainId = req.params.subdomainId;
		const dnsRecords = await DNSRecord.find({ subdomain: subdomainId });
		return res.status(200).send({
			message: "DNS Records retrieved successfully",
			data: dnsRecords,
		});
	} catch (error) {
		console.log(error);
		return res
			.status(500)
			.send({ message: "Internal server error", error: error.message });
	}
};

const handleUpdateDNSRecord = async (req, res) => {
	try {
		const { type, content, ttl } = req.body;
		const dnsRecordId = req.params.dnsRecordId;
		const { name, _id: subdomainId } = req.subdomain;
		const isDataExists = await DNSRecord.findOne({
			type,
			name,
			content,
			ttl,
		});

		if (isDataExists) {
			return res.status(400).send({
				message: "DNS record with this data already exists",
				error: "Bad Request",
			});
		}

		const dnsData = await DNSRecord.findOne({
			_id: dnsRecordId,
		});

		const extRecordId = dnsData.extRecordId;

		const extData = await Record.findByIdAndUpdate(extRecordId, {
			type,
			name,
			content,
			ttl,
		});

		const updatedDNSRecord = await DNSRecord.findByIdAndUpdate(
			dnsRecordId,
			{ type, name, content, ttl },
			{ new: true }
		);

		return res.status(200).send({
			message: "DNS Record updated successfully",
			data: updatedDNSRecord,
		});
	} catch (error) {
		console.log(error);
		return res
			.status(500)
			.send({ message: "Internal server error", error: error.message });
	}
};

const handleDeleteDNSRecord = async (req, res) => {
	try {
		const dnsRecordId = req.params.dnsRecordId;
		const dnsData = await DNSRecord.findOne({
			_id: dnsRecordId,
		});
		const extRecordId = dnsData.extRecordId;
		await Record.findByIdAndDelete(extRecordId);
		await DNSRecord.findByIdAndDelete(dnsRecordId);
		return res
			.status(200)
			.send({ message: "DNS Record deleted successfully" });
	} catch (error) {
		console.log(error);
		return res
			.status(500)
			.send({ message: "Internal server error", error: error.message });
	}
};

const handleGetDNSRecord = async (req, res) => {
	try {
		const { subdomainId, dnsRecordId } = req.params;
		const dnsRecord = await DNSRecord.findOne({
			_id: dnsRecordId,
			subdomain: subdomainId,
		});
		if (!dnsRecord) {
			return res.status(404).send({
				message: "DNS Record not found",
				error: "Not Found",
			});
		}
		return res.status(200).send({
			message: "DNS Record retrieved successfully",
			data: dnsRecord,
		});
	} catch (error) {
		console.log(error);
		return res
			.status(500)
			.send({ message: "Internal server error", error: error.message });
	}
};

module.exports = {
	handleCreateDNSRecord,
	handleGetAllDNSRecords,
	handleUpdateDNSRecord,
	handleGetDNSRecord,
	handleDeleteDNSRecord,
};
