const DNSRecord = require("../models/DNSRecord");
const Record = require("../models/Record");
const mongoose = require("mongoose");

const handleCreateDNSRecord = async (req, res) => {
	const session = await mongoose.startSession();
	session.startTransaction();

	try {
		const { type, content, ttl } = req.body;
		const ownerUserId = req.user._id;
		const { name, _id: subdomainId } = req.subdomain;

		const existingCNAME = await DNSRecord.findOne({
			name,
			subdomain: subdomainId,
			type: "CNAME",
		}).session(session);

		if (type === "CNAME") {
			const existingAny = await DNSRecord.findOne({
				name,
				subdomain: subdomainId,
				type: ["AAAA", "A", "CNAME"],
			}).session(session);

			if (existingAny) {
				await session.abortTransaction();
				session.endSession();
				return res.status(400).send({
					message:
						"CNAME record cannot coexist with other records on the same name",
					error: "Bad Request",
				});
			}
		} else {
			if (existingCNAME && (type === "A" || type === "AAAA")) {
				await session.abortTransaction();
				session.endSession();
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
			}).session(session);

			if (existingRecord) {
				await session.abortTransaction();
				session.endSession();
				return res.status(400).send({
					message: `${type} record with this content already exists`,
					error: "Bad Request",
				});
			}
		}

		const extDnsRecord = await Record.create(
			[
				{
					type,
					name,
					content,
					ttl,
					zone: process.env.EXT_ZONE,
				},
			],
			{ session }
		);

		const dnsRecord = await DNSRecord.create(
			[
				{
					subdomain: subdomainId,
					extRecordId: extDnsRecord[0]._id,
					ownerUserId,
					type,
					name,
					content,
					ttl,
				},
			],
			{ session }
		);

		await session.commitTransaction();
		session.endSession();

		return res.status(201).send({
			message: "DNS Record created successfully",
			data: dnsRecord[0],
		});
	} catch (error) {
		await session.abortTransaction();
		session.endSession();
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
		const dnsRecords = await DNSRecord.find({
			subdomain: subdomainId,
		}).select("-extRecordId -__v -ownerUserId");
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
	const session = await mongoose.startSession();
	session.startTransaction();

	try {
		const { type, content, ttl } = req.body;
		const dnsRecordId = req.params.dnsRecordId;
		const { name, _id: subdomainId } = req.subdomain;

		// Check if record with same data already exists
		const isDataExists = await DNSRecord.findOne({
			type,
			name,
			content,
			ttl,
		}).session(session);

		if (isDataExists) {
			await session.abortTransaction();
			session.endSession();
			return res.status(400).send({
				message: "DNS record with this data already exists",
				error: "Bad Request",
			});
		}

		// Find the DNS record
		const dnsData = await DNSRecord.findById(dnsRecordId).session(session);
		if (!dnsData) {
			await session.abortTransaction();
			session.endSession();
			return res.status(404).send({
				message: "DNS record not found",
				error: "Not Found",
			});
		}

		const extRecordId = dnsData.extRecordId;

		// Update external record
		await Record.findByIdAndUpdate(
			extRecordId,
			{ type, name, content, ttl },
			{ new: true, session }
		);

		// Update DNS record
		const updatedDNSRecord = await DNSRecord.findByIdAndUpdate(
			dnsRecordId,
			{ type, name, content, ttl },
			{ new: true, session }
		);

		await session.commitTransaction();
		session.endSession();

		return res.status(200).send({
			message: "DNS Record updated successfully",
			data: updatedDNSRecord,
		});
	} catch (error) {
		await session.abortTransaction();
		session.endSession();
		console.log(error);
		return res.status(500).send({
			message: "Internal server error",
			error: error.message,
		});
	}
};

const handleDeleteDNSRecord = async (req, res) => {
	const session = await mongoose.startSession();
	session.startTransaction();

	try {
		const dnsRecordId = req.params.dnsRecordId;

		// Find the DNS record
		const dnsData = await DNSRecord.findById(dnsRecordId).session(session);
		if (!dnsData) {
			await session.abortTransaction();
			session.endSession();
			return res.status(404).send({
				message: "DNS record not found",
				error: "Not Found",
			});
		}

		const extRecordId = dnsData.extRecordId;

		// Delete external record
		await Record.findByIdAndDelete(extRecordId, { session });

		// Delete DNS record
		await DNSRecord.findByIdAndDelete(dnsRecordId, { session });

		await session.commitTransaction();
		session.endSession();

		return res.status(200).send({
			message: "DNS Record deleted successfully",
		});
	} catch (error) {
		await session.abortTransaction();
		session.endSession();
		console.log(error);
		return res.status(500).send({
			message: "Internal server error",
			error: error.message,
		});
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

const handleVerifyDomain = async (req, res) => {
	try {
		const { name, content } = req.body;
		Record.create({
			zone: process.env.EXT_ZONE,
			type: "TXT",
			name,
			content,
			// Created a record that auto-deletes after 30 minutes
			deletedAt: new Date(Date.now() + 30 * 60 * 1000),
		});
		return res.status(200).send({
			message: "Domain verification record details",
			data: { name, content },
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
	handleVerifyDomain,
};
