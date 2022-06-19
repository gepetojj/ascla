/** @type {import("next-seo").NextSeoProps} */
export default {
	titleTemplate: "ASCLA - %s",
	title: "Academia Santanense de Ciências, Letras e Artes",
	description:
		"Acesse o site oficial da Academia Santanense de Ciências, Letras e Artes e familiarize-se com a cultura de Santana do Ipanema/AL",
	canonical:
		process.env.NODE_ENV === "development" ? "http://localhost:3000/" : "https://asclasi.com/",

	additionalLinkTags: [
		{
			rel: "icon",
			href: "/favicon.ico",
		},
	],
	additionalMetaTags: [
		{
			name: "viewport",
			content: "initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover",
		},
		{ name: "format-detection", content: "telephone=no" },
		{ name: "theme-color", content: "#83CB89" },
	],

	openGraph: {
		type: "website",
		title: "Academia Santanense de Ciências, Letras e Artes",
		description:
			"Acesse o site oficial da Academia Santanense de Ciências, Letras e Artes e familiarize-se com a cultura de Santana do Ipanema/AL",
	},
	twitter: {
		cardType: "summary_large_image",
		site: "https://asclasi.com",
	},
};
