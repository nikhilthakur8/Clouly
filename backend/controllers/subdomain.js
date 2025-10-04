const SubDomain = require("../models/Subdomain");
const DNSRecord = require("../models/DNSRecord");
const Record = require("../models/Record");
const mongoose = require("mongoose");
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

		const subdomain = await SubDomain.findById(subdomainId);

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
		const subdomains = await SubDomain.find({ ownerUserId })
			.select("name notes")
			.sort({
				_id: -1,
			});
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

const handleDeleteSubdomain = async (req, res) => {
	const session = await mongoose.startSession();
	session.startTransaction();
	try {
		const { subdomainId } = req.params;

		const subdomain = await SubDomain.findOneAndDeleteM(
			{ _id: subdomainId },
			{ session }
		);

		if (!subdomain) {
			await session.abortTransaction();
			session.endSession();
			return res.status(404).send({
				message: "Subdomain not found",
				error: "Not Found",
			});
		}

		await Promise.all([
			Record.deleteMany({
				name: subdomain.name,
				zone: process.env.EXT_ZONE,
			}).session(session),
			DNSRecord.deleteMany({ subdomain: subdomainId }).session(session),
		]);

		await session.commitTransaction();
		session.endSession();

		return res.status(200).send({
			message: "Subdomain and related records deleted successfully",
		});
	} catch (error) {
		await session.abortTransaction();
		session.endSession();
		console.error(error);
		return res.status(500).send({
			message: "Internal server error",
			error: error.message,
		});
	}
};

module.exports = {
	handleCreateSubdomain,
	handleGetSubdomain,
	handleGetAllSubdomains,
	handleDeleteSubdomain,
};
