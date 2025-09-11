const validateBody = (schema) => {
	return (req, res, next) => {
		const result = schema.safeParse(req.body);

		if (!result.success) {
			const errors = result.error.format();
			return res.status(400).json({
				status: "error",
				message: "Validation failed",
				errors,
			});
		}

		req.body = result.data;
		next();
	};
};

module.exports = { validateBody };
