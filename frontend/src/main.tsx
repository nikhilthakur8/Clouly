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
import { DNSRecord } from "./components/Dashboard/DNSRecord";
import { Profile } from "./components/Profile/Profile";
import { MainLayout } from "./Layout/MainLayout";
import { Api } from "./components/Api/Api";
const router = createBrowserRouter(
	createRoutesFromElements(
		<>
			<Route path="/" element={<MainLayout />}>
				<Route index element={<Home />} />
				<Route path="/" element={<UserLayout />}>
					<Route path="/dashboard" element={<Index />} />
					<Route
						path="/subdomain/:subdomainId"
						element={<DNSRecord />}
					/>
					<Route path="/profile" element={<Profile />} />
					<Route path="/api" element={<Api />} />
				</Route>
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
				<Toaster theme="dark" richColors position="bottom-right" />
				<Analytics />
				{/* <SpeedInsights /> */}
			</UserProvider>
		</>
	);
} else {
	console.error("Root element not found");
}
