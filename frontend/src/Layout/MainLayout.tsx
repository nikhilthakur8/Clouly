import NavBar from "@/components/NavBar/NavBar";
import { Outlet } from "react-router-dom";
import api from "@/api/api";
import { useUserContext } from "@/context/context";
import { useEffect, useState } from "react";

export const MainLayout = () => {
	const [loading, setLoading] = useState(true);
	const { setUser } = useUserContext();
	useEffect(() => {
		const fetchProfile = async () => {
			try {
				setLoading(true);
				const response = await api.get("/user/profile");
				setUser(response.data.user);
			} catch (err) {
				console.error(err);
			} finally {
				setLoading(false);
			}
		};

		fetchProfile();
	}, []);

	if (loading) {
		return (
			<div className="flex justify-center items-center min-h-screen">
				<div className="flex flex-col items-center space-y-3">
					<svg
						className="h-10 w-10 animate-spin text-primary"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
					>
						<circle
							className="opacity-25"
							cx="12"
							cy="12"
							r="10"
							stroke="currentColor"
							strokeWidth="4"
						></circle>
						<path
							className="opacity-75"
							fill="currentColor"
							d="M4 12a8 8 0 018-8V0C5.373 0 0 
            5.373 0 12h4zm2 5.291A7.962 7.962 0 
            014 12H0c0 3.042 1.135 5.824 3 
            7.938l3-2.647z"
						></path>
					</svg>
				</div>
			</div>
		);
	} else
		return (
			<>
				<NavBar />
				<Outlet />
			</>
		);
};
