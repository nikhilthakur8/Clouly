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
		deletedAt: {
			type: Date,
			default: null,
		},
	},
	{ timestamps: true }
);

recordSchema.index({ deletedAt: 1 }, { expireAfterSeconds: 0 });

const Record = mongoose.model("Record", recordSchema);

module.exports = Record;
