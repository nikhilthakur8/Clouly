const handleGetUserProfile = async function (req, res) {
	const { passwordHash: _, ...safeUser } = req.user;
	return res.status(200).json({
		message: "Profile Fetched Successfully",
		user: safeUser,
	});
};

module.exports = {
	handleGetUserProfile,
};
