import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getGithubOAuthLink, getGoogleOAuthLink } from "../../utils/oauthLink";
import { toast } from "sonner";
import api from "@/api/api";

type RegisterFormData = {
	name: string;
	email: string;
	password: string;
};

export const Register = () => {
	const [loading, setLoading] = useState(false);
	const [searchParams] = useSearchParams();
	const [isPasswordVisible, setIsPasswordVisible] = useState(false);
	const redirectUri = searchParams.get("redirect_uri") || "/";
	const navigate = useNavigate();
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<RegisterFormData>();

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

	useEffect(() => {
		window.document.title = "Register - Clouly";
	}, []);

	const onSubmit = async (data: RegisterFormData) => {
		setLoading(true);
		try {
			const response = await api.post("auth/register", data);
			toast.success("Welcome to Clouly!");
			if (response.data) navigate(redirectUri);
		} catch (error: any) {
			console.error("Login failed:", error);
			toast.error(
				error?.response?.data?.message || "Something went wrong"
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-svh bg-black flex items-center justify-center px-4 py-8">
			<Card className="bg-black border border-neutral-800 rounded-xl w-full max-w-sm sm:max-w-md shadow-2xl">
				<CardHeader className="text-center">
					<CardTitle className="text-gray-300 text-2xl sm:text-3xl font-bold">
						Clouly
					</CardTitle>
					<CardDescription className="text-zinc-400 text-sm sm:text-base">
						Start your journey with Clouly
					</CardDescription>
				</CardHeader>

				<CardContent className="space-y-4">
					<form
						onSubmit={handleSubmit(onSubmit)}
						className="space-y-4"
					>
						<Input
							type="text"
							placeholder="Name"
							{...register("name", {
								required: "Name is required",
								minLength: {
									value: 2,
									message: "Minimum 2 characters",
								},
							})}
							errors={errors.name?.message as string}
							className="bg-zinc-900 text-white border border-white/20"
						/>

						<Input
							type="email"
							placeholder="Email"
							{...register("email", {
								required: "Email is required",
								pattern: {
									value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
									message: "Invalid email address",
								},
							})}
							errors={errors.email?.message as string}
							className="bg-zinc-900 text-white border border-white/20"
						/>
						<Input
							placeholder="Password"
							{...register("password", {
								required: "Password is required",
								minLength: {
									value: 6,
									message: "Minimum 6 characters",
								},
							})}
							passwordField={{
								isPasswordVisible,
								setIsPasswordVisible,
							}}
							type={isPasswordVisible ? "text" : "password"}
							className="bg-zinc-900 text-white border border-white/20"
							errors={errors.password?.message as string}
						/>
						<Button
							type="submit"
							className="w-full !text-base"
							disabled={loading}
							variant="default"
						>
							{loading ? "Registering..." : "Register"}
						</Button>
					</form>

					<div className="flex items-center gap-2 my-2">
						<hr className="flex-1 border-white/20" />
						<span className="text-zinc-400 text-sm">OR</span>
						<hr className="flex-1 border-white/20" />
					</div>

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
								className="w-5 h-5"
								alt="GitHub Icon"
							/>
							Continue with GitHub
						</Button>
					</div>

					<div className="mt-4 text-center text-xs sm:text-sm text-zinc-400">
						Already have an account?{" "}
						<Link
							to="/login"
							className="underline hover:text-white"
						>
							Login
						</Link>
					</div>
				</CardContent>
			</Card>
		</div>
	);
};
