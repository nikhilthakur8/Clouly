const z = require("zod");

const oauthSchema = z.object({
	provider: z.enum(["google", "github"], "Invalid provider"),
	code: z.string().min(1, "Code is required"),
});

module.exports = {
	oauthSchema,
};
