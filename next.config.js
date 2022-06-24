const withBA = require("@next/bundle-analyzer")({ enabled: process.env.ANALYZE === "true" });
const { createSecureHeaders } = require("next-secure-headers");

/** @type {import('next').NextConfig} */
const nextConfig = withBA({
	reactStrictMode: true,
	swcMinify: true,
	compiler: {
		reactRemoveProperties: true,
	},
	poweredByHeader: false,
	images: {
		domains: [
			"lh3.googleusercontent.com",
			"firebasestorage.googleapis.com",
			process.env.NODE_ENV === "development" && "localhost",
		],
	},
	headers: async () => {
		return [
			{
				source: "/(.*)",
				headers: createSecureHeaders({
					forceHTTPSRedirect: [
						true,
						{ maxAge: 60 * 60 * 24 * 4, includeSubDomains: true, preload: true },
					],
					referrerPolicy: "strict-origin-when-cross-origin",
				}),
			},
		];
	},
});

module.exports = nextConfig;
