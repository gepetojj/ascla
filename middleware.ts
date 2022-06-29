import { withAuth } from "next-auth/middleware";

export default withAuth({
	callbacks: {
		authorized: ({ req, token }) => {
			if (req.nextUrl.pathname.startsWith("/conta/dados")) return !!token;
			if (req.nextUrl.pathname.startsWith("/admin")) {
				return !!token && token.role !== "common";
			}

			return true;
		},
	},
});
