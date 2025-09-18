const authRouter = require("express").Router();
const {
	loginOrRegisterSchema,
	loginSchema,
	oauthSchema,
	registerSchema,
} = require("../validations/authSchema");
const { validateBody } = require("../middleware/validateBody");
const {
	handleLoginOrRegister,
	handleLogin,
	handleOAuthCallback,
	handleRegister,
} = require("../controllers/auth");

authRouter.post(
	"/login-or-register",
	validateBody(loginOrRegisterSchema),
	handleLoginOrRegister
);

authRouter.post("/login", validateBody(loginSchema), handleLogin);
authRouter.post("/register", validateBody(registerSchema), handleRegister);
authRouter.post("/oauth", validateBody(oauthSchema), handleOAuthCallback);

module.exports = authRouter;
