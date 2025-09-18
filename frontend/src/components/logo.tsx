export default function Logo() {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="50"
			height="50"
			viewBox="0 0 120 120"
			fill="none"
		>
			<path
				d="M60 30C50 30 42 38 41 47C31 47 24 54 24 63C24 72 31 79 40 79H82C91 79 98 72 98 63C98 55 92 48 84 47C82 37 72 30 60 30Z"
				fill="url(#cloudGradient)"
				stroke="#2D6CDF"
				stroke-width="3"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>

			<circle cx="45" cy="60" r="4" fill="#2D6CDF" />
			<circle cx="60" cy="60" r="4" fill="#2D6CDF" />
			<circle cx="75" cy="60" r="4" fill="#2D6CDF" />

			<line
				x1="49"
				y1="60"
				x2="56"
				y2="60"
				stroke="#2D6CDF"
				stroke-width="2"
			/>
			<line
				x1="64"
				y1="60"
				x2="71"
				y2="60"
				stroke="#2D6CDF"
				stroke-width="2"
			/>

			<defs>
				<linearGradient
					id="cloudGradient"
					x1="24"
					y1="30"
					x2="98"
					y2="79"
					gradientUnits="userSpaceOnUse"
				>
					<stop stop-color="#A5C9FF" />
					<stop offset="1" stop-color="#2D6CDF" />
				</linearGradient>
			</defs>
		</svg>
	);
}
