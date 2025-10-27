const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/jwt");
const User = require("../models/User");
const axios = require("axios");
const { decode } = require("jsonwebtoken");

async function exchangeCodeForToken(provider, code) {
	if (!code) throw new Error("Missing authorization code");

	if (provider === "google") {
		const response = await axios.post(
			"https://oauth2.googleapis.com/token",
			{
				code,
				client_id: process.env.GOOGLE_CLIENT_ID,
				client_secret: process.env.GOOGLE_CLIENT_SECRET,
				redirect_uri: process.env.GOOGLE_REDIRECT_URI,
				grant_type: "authorization_code",
			}
		);
		return response.data.id_token;
	} else if (provider === "github") {
		const response = await axios.post(
			"https://github.com/login/oauth/access_token",
			{
				code,
				client_id: process.env.GITHUB_CLIENT_ID,
				client_secret: process.env.GITHUB_CLIENT_SECRET,
				redirect_uri: process.env.GITHUB_REDIRECT_URI,
			},
			{ headers: { Accept: "application/json" } }
		);
		return response.data.access_token;
	}

	throw new Error(`Unsupported provider: ${provider}`);
}

async function getUserInfo(provider, token) {
	if (provider === "google") {
		const decoded = decode(token);
		if (!decoded?.email) throw new Error("Invalid Google token");
		return {
			name: decoded.name,
			email: decoded.email,
			picture: decoded.picture,
		};
	} else if (provider === "github") {
		const [userRes, emailsRes] = await Promise.all([
			axios.get("https://api.github.com/user", {
				headers: { Authorization: `Bearer ${token}` },
			}),
			axios.get("https://api.github.com/user/emails", {
				headers: { Authorization: `Bearer ${token}` },
			}),
		]);

		const primaryEmail = emailsRes.data.find((e) => e.primary)?.email;
		if (!primaryEmail) throw new Error("GitHub primary email not found");

		return {
			name: userRes.data.name || userRes.data.login,
			email: primaryEmail,
			picture: userRes.data.avatar_url,
		};
	}

	throw new Error(`Unsupported provider: ${provider}`);
}

async function upsertUser({ name, email, picture }) {
	let user = await User.findOne({ email });
	let isNewUser = false;

	if (!user) {
		user = await User.create({ name, email, picture, isVerified: true });
		isNewUser = true;
	} else {
		const update = {};
		if (user.name !== name) update.name = name;
		if (user.picture !== picture) update.picture = picture;

		if (Object.keys(update).length > 0) {
			await User.updateOne({ _id: user._id }, { $set: update });
		}
	}

	return { user, isNewUser };
}

const handleOAuthCallback = async (req, res) => {
	const { code, provider } = req.body;
	try {
		const oAuthToken = await exchangeCodeForToken(provider, code);

		const userInfo = await getUserInfo(provider, oAuthToken);

		const { user, isNewUser } = await upsertUser(userInfo);

		const token = generateToken({ id: user._id });

		return res.json({
			success: true,
			token,
			message: isNewUser
				? "Account created successfully."
				: "Account logged in successfully.",
		});
	} catch (error) {
		console.error("OAuth Error:", error?.response?.data || error.message);
		return res.status(500).json({
			success: false,
			message: error.message || "Authentication failed.",
		});
	}
};

async function handleLogout(req, res) {
	res.clearCookie("CLOULY_SESSION", {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		maxAge: 24 * 60 * 60 * 1000,
		domain:
			process.env.NODE_ENV === "production" ? ".clouly.in" : "localhost",
	});
	return res.json({ message: "Logged out successfully" });
}

module.exports = {
	handleOAuthCallback,
	handleLogout,
};
