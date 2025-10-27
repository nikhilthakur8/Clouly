"use client";

import { Moon, SunDim } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { flushSync } from "react-dom";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
type props = {
	className?: string;
};

export const AnimatedThemeToggler = ({ className }: props) => {
	const { theme, setTheme } = useTheme();
	const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
	const buttonRef = useRef<HTMLButtonElement | null>(null);

	useEffect(() => {
		setIsDarkMode(theme === "dark");
	}, [theme]);

	const changeTheme = async () => {
		const nextTheme = isDarkMode ? "light" : "dark";
		if (!buttonRef.current) return;

		await document.startViewTransition(() => {
			flushSync(() => {
				const dark = document.documentElement.classList.toggle("dark", nextTheme === "dark");
				setIsDarkMode(dark);
				setTheme(nextTheme);
			});
		}).ready;

		const { top, left, width, height } =
			buttonRef.current.getBoundingClientRect();
		const y = top + height / 2;
		const x = left + width / 2;

		const right = window.innerWidth - left;
		const bottom = window.innerHeight - top;
		const maxRad = Math.hypot(Math.max(left, right), Math.max(top, bottom));

		document.documentElement.animate(
			{
				clipPath: [
					`circle(0px at ${x}px ${y}px)`,
					`circle(${maxRad}px at ${x}px ${y}px)`,
				],
			},
			{
				duration: 700,
				easing: "ease-in-out",
				pseudoElement: "::view-transition-new(root)",
			}
		);
	};
	return (
		<button ref={buttonRef} onClick={changeTheme} className={cn(className)}>
			{isDarkMode ? (
				<SunDim className="h-5 w-5" />
			) : (
				<Moon className="h-5 w-5" />
			)}
		</button>
	);
};
