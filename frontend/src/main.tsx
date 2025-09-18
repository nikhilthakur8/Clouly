import { createRoot } from "react-dom/client";
import "./index.css";
import { App } from "./App";
import {
	createBrowserRouter,
	createRoutesFromElements,
	Route,
	RouterProvider,
} from "react-router-dom";
import { Login } from "./components/Auth/Login";
import { Register } from "./components/Auth/Register";
import { Toaster } from "sonner";
import { Home } from "./components/Home/Home";
const router = createBrowserRouter(
	createRoutesFromElements(
		<>
			{/* Routes with main Layout */}
			<Route path="/" element={<App />}>
				<Route index element={<Home />} />
				<Route path="about" element={<div>About</div>} />
				<Route path="contact" element={<div>Contact</div>} />
				<Route path="*" element={<div>404 Not Found</div>} />
			</Route>
			<Route path="/login" element={<Login />} />
			<Route path="/register" element={<Register />} />
			<Route path="/contact" element={<div>Contact</div>} />
			<Route path="*" element={<div>404 Not Found</div>} />
		</>
	)
);
const rootElement = document.getElementById("root");
if (rootElement) {
	createRoot(rootElement).render(
		<>
			{/* <UserContextProvider> */}
			<RouterProvider router={router} />
			<Toaster richColors position="bottom-right" />
			{/* <Analytics /> */}
			{/* <SpeedInsights /> */}
			{/* </UserContextProvider> */}
		</>
	);
} else {
	console.error("Root element not found");
}
