const mongoose = require("mongoose");

const subdomainSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
			trim: true,
		},
		ownerUserId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		notes: String,
	},
	{ timestamps: true }
);

const Subdomain = mongoose.model("Subdomain", subdomainSchema);

module.exports = Subdomain;
