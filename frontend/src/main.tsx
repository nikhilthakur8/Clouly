import { createRoot } from "react-dom/client";
import "./index.css";
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
import { UserLayout } from "./Layout/UserLayout";
import { AuthLayout } from "./Layout/AuthLayout";
import { AuthCallback } from "./components/Auth/AuthCallback";
import { UserProvider } from "./context/UserProvider";
import { Index } from "./components/Dashboard/Index";
import { Analytics } from "@vercel/analytics/react";
const router = createBrowserRouter(
	createRoutesFromElements(
		<>
			<Route path="/" element={<UserLayout />}>
				<Route index element={<Home />} />
				<Route path="/dashboard" element={<Index />} />
			</Route>
			<Route element={<AuthLayout />}>
				<Route index element={<Home />} />
				<Route path="/login" element={<Login />} />
				<Route path="/register" element={<Register />} />
				<Route
					path="/auth/:provider/callback"
					element={<AuthCallback />}
				/>
			</Route>
		</>
	)
);
const rootElement = document.getElementById("root");
if (rootElement) {
	createRoot(rootElement).render(
		<>
			<UserProvider>
				<RouterProvider router={router} />
				<Toaster richColors position="bottom-right" theme="system" />
				<Analytics />
				{/* <SpeedInsights /> */}
			</UserProvider>
		</>
	);
} else {
	console.error("Root element not found");
}
