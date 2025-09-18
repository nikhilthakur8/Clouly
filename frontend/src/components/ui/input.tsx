import * as React from "react";
import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";

type InputProps = React.ComponentProps<"input"> & {
	errors?: string;
	passwordField?: {
		isPasswordVisible: boolean;
		setIsPasswordVisible: React.Dispatch<React.SetStateAction<boolean>>;
	};
};

function Input({
	className,
	type,
	errors,
	passwordField,
	...props
}: InputProps) {
	const isPassword = type === "password" || passwordField !== undefined;

	return (
		<div className="relative w-full">
			<input
				type={type}
				data-slot="input"
				className={cn(
					"border-input file:text-foreground placeholder:text-muted-foreground/70 flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
					"focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
					errors &&
						"border-destructive ring-destructive/50 focus-visible:ring-destructive/50",
					type === "search" &&
						"[&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none [&::-webkit-search-results-button]:appearance-none [&::-webkit-search-results-decoration]:appearance-none",
					type === "file" &&
						"text-muted-foreground/70 file:border-input file:text-foreground p-0 pr-3 italic file:me-3 file:h-full file:border-0 file:border-r file:border-solid file:bg-transparent file:px-3 file:text-sm file:font-medium file:not-italic",
					className
				)}
				{...props}
			/>

			{/* Password toggle */}
			{isPassword && passwordField && (
				<button
					type="button"
					onClick={() =>
						passwordField.setIsPasswordVisible(
							!passwordField.isPasswordVisible
						)
					}
					className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
				>
					{passwordField.isPasswordVisible ? (
						<EyeOff size={16} />
					) : (
						<Eye size={16} />
					)}
				</button>
			)}

			{/* Error message */}
			{errors && (
				<p className="mt-1 text-xs text-destructive">{errors}</p>
			)}
		</div>
	);
}

export { Input };
