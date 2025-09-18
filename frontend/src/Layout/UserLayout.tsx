import { Button } from "@/components/ui/button";
import { useUserContext } from "@/context/context";
import { Link, Outlet } from "react-router-dom";

export const UserLayout = () => {
	const { user } = useUserContext();
	if (!user) {
		return (
			<div className="flex flex-col items-center justify-center min-h-[80svh] px-4">
				<h2 className="text-3xl tracking-wide text-primary mb-4">
					Login to continue
				</h2>

				<div className="gap-5 flex">
					<Button
						className="duration-200 transition-all text-lg hover:scale-105"
						asChild
						variant={"outline"}
					>
						<Link to={`/register?redirect_uri=${location.pathname}`}>
							Get Started
						</Link>
					</Button>
					<Button
						className="bg-primary text-background hover:bg-primary/90 duration-200 transition-all text-lg hover:scale-105"
						asChild
						variant={"default"}
					>
						<Link to={`/login?redirect_uri=${location.pathname}`}>
							Login
						</Link>
					</Button>
				</div>
			</div>
		);
	}
	return <Outlet />;
};
