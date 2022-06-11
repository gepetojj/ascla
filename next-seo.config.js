/** @type {import("next-seo").NextSeoProps} */
export default {
	titleTemplate: "ASCLA - %s",
	title: "Academia Santanense de Ciências, Letras e Artes",
	description:
		"Acesse o site oficial da Academia Santanense de Ciências, Letras e Artes e familiarize-se com a cultura de Santana do Ipanema/AL",
	canonical:
		process.env.NODE_ENV === "development" ? "http://localhost:3000/" : "https://ascla.com.br/",

	additionalLinkTags: [
		{
			rel: "icon",
			href: "/favicon.ico",
		},
	],

	openGraph: {
		type: "website",
		title: "Academia Santanense de Ciências, Letras e Artes",
		description:
			"Acesse o site oficial da Academia Santanense de Ciências, Letras e Artes e familiarize-se com a cultura de Santana do Ipanema/AL",
	},
	twitter: {
		cardType: "summary_large_image",
		site: "https://ascla.com.br",
	},
};
