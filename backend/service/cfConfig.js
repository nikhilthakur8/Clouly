const axios = require("axios");

const cfApiService = axios.create({
	baseURL: `https://api.cloudflare.com/client/v4/zones/${process.env.CF_ZONE_ID}`,
	headers: {
		"X-Auth-Key": process.env.CF_API_TOKEN,
		"X-Auth-Email": process.env.CF_API_EMAIL,
		"Content-Type": "application/json",
	},
});

module.exports = cfApiService;
