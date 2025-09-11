const { Types } = require("mongoose");
const z = require("zod");

const subdomainZodSchema = z
	.object({
		name: z
			.string()
			.trim()
			.min(1, "Subdomain name is required")
			.regex(
				/^[a-z0-9-]+$/,
				"Subdomain name must be lowercase alphanumeric or hyphen"
			)
			.transform((val) => val.toLowerCase()),

		notes: z
			.string()
			.optional()
			.nullable()
			.transform((val) => val?.trim()),
	})
	.strict();

module.exports = { subdomainZodSchema };
