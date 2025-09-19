const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const { authenticate } = require("./middleware/authenticate");
const {
	normalLimiter,
	dnsLimiter,
	loginLimiter,
} = require("./service/limiter");
require("dotenv").config();
const cookieParser = require("cookie-parser");

const app = express();

app.use(cookieParser());
app.use(
	cors({
		origin: (origin, callback) => {
			if (!origin) return callback(null, true);

			const allowed = [
				/^https:\/\/([a-zA-Z0-9-]+\.)*clouly\.in$/,
				/^http:\/\/localhost:5173$/,
			];

			if (allowed.some((regex) => regex.test(origin))) {
				callback(null, true);
			} else {
				callback(new Error("Not allowed by CORS"));
			}
		},
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
