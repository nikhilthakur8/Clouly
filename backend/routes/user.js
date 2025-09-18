const userRouter = require("express").Router();
const { handleGetUserProfile } = require("../controllers/user");

userRouter.get("/profile", handleGetUserProfile);

module.exports = userRouter;
