module.exports = {
	async onBuild({ netlifyConfig }) {
		const fn = netlifyConfig.functions["___netlify-handler"];

		fn.included_files = fn.included_files.filter(f => f !== "!node_modules/sharp/**/*");
	},
};
