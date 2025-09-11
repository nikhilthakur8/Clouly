const mongoose = require("mongoose");

const dnsRecordSchema = new mongoose.Schema(
	{
		subdomain: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "SubDomain",
			required: true,
		},
		ownerUserId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		cfId: {
			type: String,
			required: true,
			unique: true,
			index: true,
		},
		type: {
			type: String,
			enum: ["A", "AAAA", "TXT", "CNAME"],
			required: true,
		},
		name: {
			type: String,
			required: true,
		},
		content: {
			type: String,
			required: true,
			index: true,
		},
		ttl: {
			type: Number,
			default: 3600,
		},
		priority: {
			type: Number,
			default: null,
		},
		proxied: {
			type: Boolean,
			default: false,
		},
	},
	{
		timestamps: true,
	}
);

const DNSRecord = mongoose.model("DNSRecord", dnsRecordSchema);

module.exports = DNSRecord;
