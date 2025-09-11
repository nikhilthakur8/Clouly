const z = require("zod");
const userZodSchema = z
	.object({
		email: z
			.email("Invalid email address")
			.transform((val) => val.toLowerCase()),
		password: z
			.string()
			.min(6, "Password must be at least 6 characters"),
		name: z
			.string()
			.min(1, "Name cannot be empty")
			.max(100, "Name too long")
			.optional(),
		role: z.enum(["user"]).default("user"),
	})
	.strict();

module.exports = userZodSchema;
