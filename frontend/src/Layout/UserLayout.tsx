import { Button } from "@/components/ui/button";
import { useUserContext } from "@/context/context";
import { Link, Outlet } from "react-router-dom";

export const UserLayout = () => {
	const { user } = useUserContext();
	if (!user) {
		return (
			<div className="flex flex-col items-center justify-center min-h-svh text-white px-4">
				<h2 className="text-3xl font-bold mb-4">Login to continue</h2>

				<Button
					className="bg-primary text-background hover:bg-primary/90 duration-200 transition-all hover:scale-105"
					asChild
					variant={"default"}
				>
					<Link to={`/login?redirect_uri=${location.pathname}`}>
						Login
					</Link>
				</Button>
			</div>
		);
	}
	return <Outlet />;
};
