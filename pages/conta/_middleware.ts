import { withAuth } from "next-auth/middleware";

export default withAuth({
	callbacks: {
		authorized: ({ req, token }) => {
			if (req.page.name === "/conta") return true;

			return !!token;
		},
	},
});
