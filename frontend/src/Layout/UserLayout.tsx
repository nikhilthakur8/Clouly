import NavBar from "@/components/comp-587";
import { Outlet } from "react-router-dom";

export const UserLayout = () => {
	return (
		<>
			<NavBar />
			<Outlet />
		</>
	);
};
