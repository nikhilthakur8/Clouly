import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, useParams } from "react-router-dom";
import { toast } from "sonner";
import api from "@/api/api";

export const AuthCallback = () => {
	const navigate = useNavigate();
	const { provider } = useParams();
	const [searchParams] = useSearchParams();
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const code = searchParams.get("code");
		const redirectUri = searchParams.get("state") || "/";

		if (!code || !provider) {
			toast.error("Invalid authentication code or provider");
			navigate("/login");
			return;
		}

		const handleAuth = async () => {
			try {
				const response = await api.post("auth/oauth", {
					code,
					provider,
				});

				if (response.data.success) {
					toast.success(response.data.message || "Login successful!");
					if (response.data) navigate(redirectUri);
				} else {
					toast.error("Login failed: " + response.data.message);
					navigate("/login");
				}
			} catch (error: any) {
				console.error("Login failed:", error);
				toast.error(
					"Login Failed: " +
						(error?.message || "Something went wrong")
				);
				navigate("/login");
			} finally {
				setLoading(false);
			}
		};

		handleAuth();
	}, []);

	return (
		<div className="flex flex-col items-center justify-center min-h-svh bg-black text-gray-100 px-4">
			{loading && (
				<div className="w-10 h-10 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mb-6"></div>
			)}

			<h2 className="text-2xl font-semibold tracking-tight mb-2">
				{loading ? "Setting up your account..." : "Almost there..."}
			</h2>
			<p className="text-gray-400 text-sm mb-4 max-w-sm text-center">
				{loading ? "Hang tight !" : "All set! Redirecting you now."}
			</p>

			{loading && (
				<p className="text-xs text-gray-500 mt-2 italic">
					Securely connecting your account...
				</p>
			)}
		</div>
	);
};
