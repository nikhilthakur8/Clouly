import NavBar from "@/components/NavBar/NavBar";
import { Outlet } from "react-router-dom";
import api from "@/api/api";
import { useUserContext } from "@/context/context";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

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
				<div className="flex flex-col items-center animate-spin space-y-3">
					<Loader2 size={32} />
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
