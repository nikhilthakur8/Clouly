const handleGetUserProfile = async function (req, res) {
	const safeUser = {
		_id: req.user._id,
		email: req.user.email,
		name: req.user.name,
		picture: req.user.picture || null,
		role: req.user.role,
		createdAt: req.user.createdAt,
		updatedAt: req.user.updatedAt,
	};
	return res.status(200).json({
		message: "Profile Fetched Successfully",
		user: safeUser,
	});
};

module.exports = {
	handleGetUserProfile,
};
