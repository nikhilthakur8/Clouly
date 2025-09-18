const mongoose = require("mongoose");

const recordSchema = new mongoose.Schema(
	{
		zone: {
			type: String,
			required: true,
			lowercase: true,
		},
		name: {
			type: String,
			required: true,
			index: true,
			lowercase: true,
		},
		type: {
			type: String,
			enum: ["A", "CNAME", "TXT", "AAAA"],
			required: true,
			index: true,
		},
		content: {
			type: String,
			required: true,
		},
		ttl: {
			type: Number,
			default: 3600,
		},
	},
	{ timestamps: true }
);

recordSchema.index({ zone: 1, name: 1, type: 1 }, { unique: true });

const Record = mongoose.model("Record", recordSchema);

module.exports = Record;
