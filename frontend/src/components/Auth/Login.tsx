import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getGithubOAuthLink, getGoogleOAuthLink } from "../../utils/oauthLink";
export const Login = () => {
	const [loading, setLoading] = useState(false);
	const [searchParams] = useSearchParams();
	const redirectUri = searchParams.get("redirect_uri") || "/";

	useEffect(() => {
		window.document.title = "Login - Clouly";
	}, []);
	const handleGoogleLogin = async () => {
		setLoading(true);
		const authUrl = await getGoogleOAuthLink(redirectUri);
		window.location.href = authUrl;
	};

	const handleGithubLogin = async () => {
		setLoading(true);
		const authUrl = await getGithubOAuthLink(redirectUri);
		window.location.href = authUrl;
	};

	return (
		<div className="min-h-svh flex items-center justify-center px-4 py-8">
			<Card className="rounded-xl w-full max-w-sm sm:max-w-md shadow-2xl">
				<CardHeader className="text-center">
					<CardTitle className="text-2xl sm:text-3xl font-bold">
						Clouly
					</CardTitle>
					<CardDescription className="text-sm sm:text-base">
						Start your journey with Clouly
					</CardDescription>
				</CardHeader>

				<CardContent className="space-y-4">
					{/* Social Login Buttons */}
					<div className="space-y-2">
						<Button
							className="w-full !text-base flex items-center justify-center gap-2"
							onClick={handleGoogleLogin}
							disabled={loading}
							variant={"default"}
						>
							<img
								src="/google-icon.svg"
								className="w-5 h-5"
								alt="Google Icon"
							/>
							Continue with Google
						</Button>

						<Button
							className="w-full !text-base flex items-center justify-center gap-2"
							onClick={handleGithubLogin}
							disabled={loading}
							variant={"default"}
						>
							<img
								src="/github-icon.svg"
								className="w-5 h-5 rounded-full border bg-white"
								alt="GitHub Icon"
							/>
							Continue with GitHub
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
};
