const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const {
	authenticate,
	authenticateSubdomainOwnership,
} = require("./middleware/authenticate");
require("dotenv").config();
const cookieParser = require("cookie-parser");

const app = express();

app.use(cookieParser());
app.use(
	cors({
		origin:
			process.env.NODE_ENV === "production"
				? "https://clouly.in"
				: "http://localhost:5173",
		credentials: true,
	})
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/status", (req, res) => res.send("Chal rha hu bhai "));
app.use("/api/auth/", require("./routes/auth"));
app.use("/api/subdomain", authenticate, require("./routes/dns"));
app.use("/api/user", authenticate, require("./routes/user"));

app.listen(3000, async () => {
	console.log("Server is running on port 3000");
	await connectDB();
});
