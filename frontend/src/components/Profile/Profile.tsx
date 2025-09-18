import { useEffect, useState } from "react";
import {
	Card,
	CardHeader,
	CardTitle,
	CardContent,
	CardFooter,
} from "@/components/ui/card";
import { User as UserIcon, Mail, Calendar, Shield, LogOut } from "lucide-react";
import { useUserContext } from "@/context/context";
import { Button } from "../ui/button";
import api from "@/api/api";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export const Profile = () => {
	const { user } = useUserContext();
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);
	useEffect(() => {
		document.title = "Profile - Clouly";
	}, []);

	const getAvatarUrl = (name: string) => {
		const encodedName = encodeURIComponent(name);
		return `https://api.dicebear.com/7.x/pixel-art/svg?seed=${encodedName}`;
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	};
	const handleLogout = async () => {
		setLoading(true);
		try {
			await api.post("/auth/logout").then((res) => {
				window.location.href = "/";
			});
			navigate("/");
		} catch (error) {
			console.error("Logout failed", error);
			toast.error("Logout failed. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	if (!user) {
		return (
			<div className="p-6 max-w-2xl mx-auto">
				<h1 className="text-2xl tracking-wide mb-6">Profile</h1>
				<p className="text-muted-foreground">No user data available.</p>
			</div>
		);
	}

	return (
		<div className="p-6 max-w-2xl mx-auto">
			<h1 className="text-2xl tracking-wide mb-6">Profile</h1>
			<Card>
				<CardHeader className="text-center">
					<div className="flex justify-center mb-4">
						<img
							src={
								user.picture ||
								getAvatarUrl(user.name || user.email)
							}
							alt={user.name || "user"}
							className="w-24 h-24 rounded-full border-4 border-border"
						/>
					</div>
					<CardTitle className="text-xl">
						{user.name || "User"}
					</CardTitle>
					<p className="text-base text-muted-foreground">
						{user.email}
					</p>
				</CardHeader>

				<CardContent className="space-y-4">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="flex items-center gap-3 p-3 bg-accent/30 rounded-lg">
							<UserIcon className="h-5 w-5 text-primary" />
							<div>
								<p className="text-sm font-medium">Name</p>
								<p className="text-base">
									{user.name || "Not provided"}
								</p>
							</div>
						</div>

						<div className="flex items-center gap-3 p-3 bg-accent/30 rounded-lg">
							<Mail className="h-5 w-5 text-primary shrink-0" />
							<div>
								<p className="text-sm font-medium">Email</p>
								<p className="text-base break-all">
									{user.email}
								</p>
							</div>
						</div>

						<div className="flex items-center gap-3 p-3 bg-accent/30 rounded-lg">
							<Shield className="h-5 w-5 text-primary" />
							<div>
								<p className="text-sm font-medium">Role</p>
								<p className="text-base capitalize">
									{user.role}
								</p>
							</div>
						</div>

						<div className="flex items-center gap-3 p-3 bg-accent/30 rounded-lg">
							<Calendar className="h-5 w-5 text-primary" />
							<div>
								<p className="text-sm font-medium">
									Member Since
								</p>
								<p className="text-base">
									{formatDate(user.createdAt)}
								</p>
							</div>
						</div>
					</div>
				</CardContent>
				<CardFooter>
					<Button asChild className="text-base px-10 mx-auto">
						<div
							onClick={handleLogout}
							className="text-base flex items-center gap-2 justify-center"
						>
							{loading ? "Logging Out..." : "Log Out"}
							<LogOut />
						</div>
					</Button>
				</CardFooter>
			</Card>
		</div>
	);
};
