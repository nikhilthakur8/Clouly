import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const Home = () => {
	return (
		<div className="bg-background text-foreground flex flex-col min-h-[80svh] max-w-6xl mx-auto justify-center items-center px-4 sm:px-6 text-center">
			<h1 className="text-3xl sm:text-4xl md:text-6xl leading-snug sm:leading-tight">
				<span className="text-foreground">Unlimited Free&nbsp;</span>
				<span className="text-primary">Subdomains</span>
				<br className="block" />
				<span className="text-foreground">with Clouly</span>
			</h1>

			<p className="mt-4 sm:mt-6 text-sm sm:text-base md:text-xl text-muted-foreground max-w-lg sm:max-w-2xl">
				Clouly lets you create and manage subdomains under{" "}
				<strong>clouly.in</strong> - a fast, secure, and
				developer-friendly way to keep all your subdomains in one place.
			</p>

			<div className="mt-6 sm:mt-8 flex sm:flex-row gap-3 sm:gap-4 justify-center">
				<Button
					className="text-sm sm:text-lg px-5 sm:px-6 py-2 sm:py-3 bg-primary text-background hover:bg-primary/90 duration-200 transition-all hover:scale-105"
					asChild
				>
					<Link to="/login">Start for Free</Link>
				</Button>
				<Button
					variant="outline"
					className="text-sm sm:text-lg px-5 sm:px-6 py-2 sm:py-3 hover:bg-accent/20"
					asChild
				>
					<Link to="/learn-more">Learn More</Link>
				</Button>
			</div>
		</div>
	);
};
