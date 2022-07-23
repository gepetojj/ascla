import { config } from "config";

/** @type {import("next-seo").NextSeoProps} */
export default {
	titleTemplate: `${config.shortName} - %s`,
	title: config.fullName,
	description: `Acesse o site oficial da ${config.fullName} e familiarize-se com a cultura de Santana do Ipanema/AL`,
	canonical: config.basePath,

	additionalLinkTags: [
		{
			rel: "icon",
			href: "/favicon.ico",
		},
	],
	additionalMetaTags: [
		{
			name: "keywords",
			content:
				"academia, literatura, cultura, santana do ipanema, santana, ascla, aslca, academia satanense de letras, alagoas",
		},
		{
			name: "viewport",
			content: "initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover",
		},
		{ name: "format-detection", content: "telephone=no" },
		{ name: "theme-color", content: "#83CB89" },
	],

	openGraph: {
		type: "website",
		title: config.fullName,
		description: `Acesse o site oficial da ${config.fullName} e familiarize-se com a cultura de Santana do Ipanema/AL`,
		images: [
			{
				url: `${config.basePath}/images/meta-banner-ascla.png`,
				width: 1200,
				height: 628,
				alt: "Imagem com o logotipo da academia e seu título.",
				type: "image/png",
			},
		],
	},
	twitter: {
		cardType: "summary_large_image",
		site: config.basePath,
	},
};
