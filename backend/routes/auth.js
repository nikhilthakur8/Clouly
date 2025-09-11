const authRouter = require("express").Router();
const UserSchema = require("../validations/userSchema");
const { validateBody } = require("../middleware/validateBody");
const { handleLoginOrRegister } = require("../controllers/auth");

authRouter.post(
	"/login-or-register",
	validateBody(UserSchema),
	handleLoginOrRegister
);

module.exports = authRouter;
