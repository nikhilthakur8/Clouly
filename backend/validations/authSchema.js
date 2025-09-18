const z = require("zod");

const registerSchema = z.object({
	email: z.email("Invalid email address"),
	password: z.string().min(6, "Password must be at least 6 characters long"),
	name: z
		.string()
		.min(2, "Name must be at least 2 characters long")
		.optional(),
	role: z.enum(["user", "admin"]).optional(),
});

const loginSchema = z.object({
	email: z.email("Invalid email address"),
	password: z.string().min(6, "Password must be at least 6 characters long"),
});

const oauthSchema = z.object({
	provider: z.enum(["google", "github"], "Invalid provider"),
	code: z.string().min(1, "Code is required"),
});

const loginOrRegisterSchema = z
	.object({
		email: z
			.email("Invalid email address")
			.transform((val) => val.toLowerCase()),
		password: z.string().min(6, "Password must be at least 6 characters"),
		name: z
			.string()
			.min(1, "Name cannot be empty")
			.max(100, "Name too long")
			.optional(),
		role: z.enum(["user"]).default("user"),
	})
	.strict();

module.exports = {
	registerSchema,
	loginSchema,
	oauthSchema,
	loginOrRegisterSchema,
};
