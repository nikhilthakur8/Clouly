const authRouter = require("express").Router();
const { oauthSchema } = require("../validations/authSchema");
const { validateBody } = require("../middleware/validateBody");
const { handleOAuthCallback, handleLogout } = require("../controllers/auth");

authRouter.post("/oauth", validateBody(oauthSchema), handleOAuthCallback);
authRouter.post("/logout", handleLogout);

module.exports = authRouter;
