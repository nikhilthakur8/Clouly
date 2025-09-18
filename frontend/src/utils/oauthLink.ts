export async function getGoogleOAuthLink(redirectUri: string = "/") {
	const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
	const REDIRECT_URI = import.meta.env.VITE_GOOGLE_REDIRECT_URI;

	const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=openid email profile&prompt=select_account&state=${encodeURIComponent(
		redirectUri
	)}`;

	return authUrl;
}

export async function getGithubOAuthLink(redirectUri: string = "/") {
	const GITHUB_CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID;
	const GITHUB_REDIRECT_URI = import.meta.env.VITE_GITHUB_REDIRECT_URI;

	const githubUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${GITHUB_REDIRECT_URI}&scope=user:email&state=${encodeURIComponent(
		redirectUri
	)}`;

	return githubUrl;
}
