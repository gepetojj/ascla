/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			colors: {
				primary: {
					main: "#83CB89",
					100: "#C9E9CC",
					200: "#B7E1BB",
					300: "#A5D9AA",
					400: "#93D298",
					500: "#6FC376",
					600: "#5DBB65",
					700: "#4BB454",
					800: "#43A24C",
				},
				secondary: {
					main: "#B4876D",
					100: "#D7BFB2",
					200: "#CEB1A1",
					300: "#C5A390",
					400: "#BC9580",
					500: "#AC7A5D",
					600: "#9E6E51",
					700: "#8E6349",
					800: "#7D5740",
				},
				cream: {
					main: "#FFF6EB",
					100: "#FFFFFF",
				},
				gray: {
					main: "#DFE0DF",
					100: "#FFFFFF",
					200: "#D3D4D3",
					300: "#C6C8C6",
					400: "#B9BBB9",
					500: "#ACAFAC",
				},
				black: {
					main: "#000000",
					100: "#1A1A1A",
					200: "#333333",
					300: "#4D4D4D",
					400: "#666666",
					500: "#808080",
				},
			},
			fontFamily: {
				body: ["'Montserrat'", "sans-serif"],
			},
			keyframes: {
				slide: {
					"0%": {
						opacity: 0,
						transform: "translateX(-100%)",
					},
					"100%": {
						opacity: 1,
						transform: "translateX(0)",
					},
				},
				appear: {
					"0%": {
						opacity: 0,
					},
					"100%": {
						opacity: 1,
					},
				},
			},
			animation: {
				slide: "slide 0.7s ease-out;",
				appear: "appear 0.15s ease-out;",
			},
		},
	},
	plugins: [require("@tailwindcss/typography")],
};
