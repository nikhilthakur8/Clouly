const { z } = require("zod");

const ipv4Regex =
	/^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}$/;
const ipv6Regex = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|(::1)|::)$/;
const hostnameRegex =
	/^(?=.{1,253}$)((?!-)[A-Za-z0-9-]{1,63}(?<!-)\.)+([A-Za-z]{2,}|xn--[A-Za-z0-9]+)\.?$/;
const dnsRecordZodSchema = z
	.object({
		type: z.enum(["A", "AAAA", "TXT", "CNAME"]),

		content: z
			.string()
			.trim()
			.min(1, "Content is required")
			.max(255, "Content is too long"),

		ttl: z.number().int().positive().default(3600),

		priority: z.number().int().nullable().optional(),
	})
	.strict()
	.superRefine((data, ctx) => {
		// Validate content based on type
		if (data.type === "A" && !ipv4Regex.test(data.content)) {
			ctx.addIssue({
				path: ["content"],
				message: "content must be a valid IPv4 address",
				code: "invalid_value",
			});
		} else if (data.type === "AAAA" && !ipv6Regex.test(data.content)) {
			ctx.addIssue({
				path: ["content"],
				message: "Content must be a valid IPv6 address",
				code: "invalid_value",
			});
		} else if (data.type === "CNAME" && !hostnameRegex.test(data.content)) {
			ctx.addIssue({
				path: ["content"],
				message: "Content must be a valid hostname for CNAME",
				code: "invalid_value",
			});
		}
	});

const dnsVerificationZodSchema = z
	.object({
		name: z.enum(["_vercel"]),
		content: z
			.string()
			.trim()
			.min(1, "Content is required")
			.max(255, "Content is too long"),
	})
	.strict();

module.exports = { dnsRecordZodSchema, dnsVerificationZodSchema };
