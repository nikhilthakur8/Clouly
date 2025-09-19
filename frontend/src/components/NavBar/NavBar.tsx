import { HouseIcon, InboxIcon, ZapIcon, X } from "lucide-react";
import { useState } from "react";

import Logo from "@/components/logo";
import { Button } from "@/components/ui/button";
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { Link } from "react-router-dom";
import { useUserContext } from "@/context/context";

const navigationLinks = [
	{ href: "/", label: "Home", icon: HouseIcon },
	{ href: "/dashboard", label: "Dashboard", icon: InboxIcon },
	{ href: "/api", label: "API", icon: ZapIcon },
];
const getAvatarUrl = (name: string) => {
	const encodedName = encodeURIComponent(name);
	return `https://api.dicebear.com/7.x/pixel-art/svg?seed=${encodedName}`;
};
export default function NavBar() {
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	const toggleMobileMenu = () => {
		setIsMobileMenuOpen(!isMobileMenuOpen);
	};
	const { user } = useUserContext();
	return (
		<>
			<header className="w-full bg-background/95 backdrop-blur-lg border-b border-border/40 sticky top-0 z-50 shadow-sm">
				<div className="mx-auto flex items-center justify-between h-16 px-4 md:px-6">
					{/* Left: Logo */}
					<div className="flex items-center flex-1">
						<span className="bg-gradient-to-r text-3xl font-medium tracking-wide from-primary to-primary/70 bg-clip-text text-transparent">
							Clouly
						</span>
					</div>

					<NavigationMenu className="hidden md:flex flex-1 justify-center">
						<NavigationMenuList className="flex gap-4">
							{navigationLinks.map((link, idx) => (
								<NavigationMenuItem key={idx}>
									<NavigationMenuLink
										asChild
										href={link.href}
										className="relative text-foreground font-normal text-lg px-4 py-2 transition-all duration-300 hover:text-primary group/nav-item !bg-transparent  data-[active]:!bg-transparent data-[active]:hover:!bg-transparent data-[active]:focus:!bg-transparent focus:outline-none"
									>
										<Link to={link.href}>
											<span className="relative z-10 whitespace-nowrap">
												{link.label}
											</span>
											<div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 h-0.5 w-0 bg-gradient-to-r from-primary to-primary/70 transition-all duration-300 group-hover/nav-item:w-full rounded-full"></div>
										</Link>
									</NavigationMenuLink>
								</NavigationMenuItem>
							))}
						</NavigationMenuList>
					</NavigationMenu>
					{/* Right: Actions & Mobile Menu */}
					<div className="flex items-center gap-3 flex-1 justify-end">
						<Button variant={"default"} asChild>
							<a
								href="https://github.com/nikhilthakur8/clouly"
								target="_blank"
								className="md:!text-base"
							>
								Star this
								<img
									src={"/github-icon.svg"}
									className="w-5 h-5 rounded-full border bg-white border-border"
								/>
							</a>
						</Button>
						{user ? (
							<Link to="/profile" className="shrink-0">
								<img
									src={
										user?.picture ||
										getAvatarUrl(user?.name)
									}
									className="w-8 h-8 md:w-9 md:h-9 rounded-full border-2 border-border"
								/>
							</Link>
						) : (
							<Button
								asChild
								variant="default"
								className="hidden md:inline-flex py-2 px-5 transition-all text-base duration-200 font-medium hover:scale-105"
							>
								<Link
									to="/login"
									className="relative overflow-hidden"
								>
									Login
								</Link>
							</Button>
						)}
						<div className="hidden md:block ml-2 hover:scale-110">
							<AnimatedThemeToggler />
						</div>

						{/* Mobile Menu Button */}
						<Button
							variant="ghost"
							size="icon"
							onClick={toggleMobileMenu}
							className="md:hidden p-2 rounded-xl hover:bg-accent/50 transition-all duration-200 hover:scale-105"
						>
							<svg
								className="w-8 h-8"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 20 20"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M4 6h16M4 12h16M4 18h16"
								/>
							</svg>
						</Button>
					</div>
				</div>
			</header>

			{/* Full Screen Mobile Menu */}
			{isMobileMenuOpen && (
				<div className="fixed inset-0 z-50 md:hidden">
					<div className="min-h-svh bg-background/95 backdrop-blur-lg flex flex-col">
						{/* Mobile Header */}
						<div className="flex items-center justify-between h-16 px-4 border-b border-border/40">
							<a
								href="/"
								className="flex items-center gap-3 font-semibold text-lg text-primary"
							>
								<Logo />
								<span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
									Clouly
								</span>
							</a>
							<Button
								variant="ghost"
								size="icon"
								onClick={toggleMobileMenu}
								className="p-2 rounded-xl hover:bg-accent/50 transition-all duration-200"
							>
								<X className="w-5 h-5" />
							</Button>
						</div>

						{/* Mobile Navigation */}
						<div className="flex-1 flex flex-col justify-center px-6">
							<nav className="space-y-8">
								{navigationLinks.map((link, idx) => {
									const Icon = link.icon;
									return (
										<a
											key={idx}
											href={link.href}
											onClick={toggleMobileMenu}
											className="flex items-center gap-4 text-2xl font-medium text-foreground hover:text-primary transition-all duration-200 group py-4"
										>
											<Icon
												size={28}
												className="text-muted-foreground group-hover:text-primary transition-colors duration-200"
											/>
											<span>{link.label}</span>
										</a>
									);
								})}
							</nav>

							{/* Mobile Actions */}
							<div className="mt-12 space-y-4">
								<Button
									asChild
									variant="ghost"
									className="w-full rounded-xl py-4 text-base hover:bg-accent/50 transition-all duration-200 font-medium"
								>
									<Link to="/login" onClick={toggleMobileMenu}>
										Sign In
									</Link>
								</Button>

								<div className="flex justify-center mt-6">
									<AnimatedThemeToggler />
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
		</>
	);
}
