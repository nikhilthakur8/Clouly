const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/jwt");
const User = require("../models/User");

const handleLoginOrRegister = async (req, res) => {
	try {
		const { email, password, name, role } = req.body;

		let user = await User.findOne({ email });

		if (user) {
			const valid = await bcrypt.compare(password, user.passwordHash);
			if (!valid) {
				return res
					.status(401)
					.json({
						message: "Invalid credentials",
						error: "Invalid credentials",
					});
			}
			const token = generateToken({ id: user._id });
			return res.status(200).json({ message: "Login successful", token });
		}

		const passwordHash = await bcrypt.hash(password, 10);
		user = await User.create({ email, passwordHash, name, role });

		const token = generateToken({ id: user._id });
		return res
			.status(201)
			.json({ message: "User created successfully", token });
	} catch (error) {
		console.error(error);
		return res
			.status(500)
			.json({ message: "Internal server error", error: error.message });
	}
};

module.exports = { handleLoginOrRegister };
