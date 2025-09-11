const DNSRecord = require("../models/DNSRecord");
const cfService = require("../service/cfConfig");
const handleCreateDNSRecord = async (req, res) => {
	try {
		const { type, name, content, ttl, proxied } = req.body;
		const ownerUserId = req.user._id;
		const subdomainId = req.params.subdomainId;

		if (name != req.subdomain.name) {
			return res.status(400).send({
				message: "DNS record name must match subdomain name",
				error: "Bad Request",
			});
		}

		if (type === "CNAME") {
			const existingCNAMEorAny = await DNSRecord.findOne({
				name,
				subdomain: subdomainId,
			});
			if (existingCNAMEorAny) {
				return res.status(400).send({
					message:
						"CNAME record already exists or name has other records",
					error: "Bad Request",
				});
			}
		} else {
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

		const payload = {
			name,
			ttl,
			type,
			content,
			proxied,
		};
		const cfResponse = await cfService.post("/dns_records", payload);

		const dnsRecord = await DNSRecord.create({
			subdomain: subdomainId,
			cfId: cfResponse.data.result.id,
			ownerUserId,
			type,
			name,
			content,
			ttl,
			proxied,
		});
		return res.status(201).send({
			message: "DNS Record created successfully",
			data: dnsRecord,
		});
	} catch (error) {
		console.log(error.response?.data.errors);
		return res
			.status(500)
			.send({ message: "Internal server error", error: error.message });
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
		const { type, name, content, ttl, proxied } = req.body;
		const subdomainId = req.params.subdomainId;
		const dnsRecordId = req.params.dnsRecordId;
		const dnsData = await DNSRecord.findOne({
			_id: dnsRecordId,
		});

		const cfId = dnsData.cfId;

		await cfService.put(`/dns_records/${cfId}`, {
			type,
			name,
			content,
			ttl,
			proxied,
		});

		const updatedDNSRecord = await DNSRecord.findByIdAndUpdate(
			dnsRecordId,
			{ type, name, content, ttl, proxied },
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
		const cfId = dnsData.cfId;
		await cfService.delete(`/dns_records/${cfId}`);
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
