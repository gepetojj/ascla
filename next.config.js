const withTM = require("next-transpile-modules")(["@material-tailwind/react"]);

/** @type {import('next').NextConfig} */
const nextConfig = withTM({
	reactStrictMode: true,
	swcMinify: true,
	compiler: {
		reactRemoveProperties: true,
	},
	poweredByHeader: false,
	images: {
		domains: ["lh3.googleusercontent.com"],
	},
	headers: async () => {
		return [
			{
				source: "/(.*)",
				headers: [
					{
						key: "X-Content-Type-Options",
						value: "nosniff",
					},
					{
						key: "X-Frame-Options",
						value: "SAMEORIGIN",
					},
					{
						key: "X-XSS-Protection",
						value: "1; mode=block",
					},
				],
			},
		];
	},
});

module.exports = nextConfig;
