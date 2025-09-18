import { useState } from "react";
import NavBar from "./components/comp-587";
import { Outlet } from "react-router-dom";
export const App = () => {
	return (
		<div>
			<NavBar />
			<Outlet />
		</div>
	);
};
