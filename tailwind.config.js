const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
	content: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			colors: {
				primary: {
					main: "#F98436",
					100: "#FCC29C",
					200: "#FBB383",
					300: "#FAA46B",
					400: "#FA9552",
					500: "#F87621",
					600: "#F76708",
					700: "#DE5D07",
					800: "#C65306",
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
					200: "#FFEAD1",
					300: "#FFDFB8",
					400: "#FFD39E",
					500: "#FFC885",
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
		},
	},
	plugins: [require("@tailwindcss/typography")],
});
