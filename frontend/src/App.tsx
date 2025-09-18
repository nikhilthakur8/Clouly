import NavBar from "./components/NavBar/NavBar";
import { Outlet } from "react-router-dom";
export const App = () => {
	return (
		<div>
			<NavBar />
			<Outlet />
		</div>
	);
};
