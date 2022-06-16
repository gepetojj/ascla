import type { User } from "entities/User";
import { Collections } from "myFirebase/enums";
import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";

export default NextAuth({
	providers: [
		GoogleProvider({
			checks: "both",
			clientId: String(process.env.GOOGLE_CLIENT_ID),
			clientSecret: String(process.env.GOOGLE_CLIENT_SECRET),
			profile: profile => {
				return {
					id: profile.sub,
					name: profile.name,
					email: profile.email,
					image: profile.picture,
				};
			},
		}),
	],
	callbacks: {
		async signIn({ account, profile }) {
			const users = Collections.users;
			const user: User = {
				id: profile.sub || "",
				metadata: {
					urlId: profile.sub || "",
					provider: account.provider,
					role: "common",
				},
				email: profile.email || "",
				avatarUrl: String(profile.picture),
				name: profile.name || "",
			};

			// Cria o usuário no banco de dados se não existir.
			const query = await users.where("id", "==", user.id).get();
			if (query.empty) {
				try {
					await users.doc(user.id).create(user);
					return true;
				} catch (err) {
					console.error(err);
					return false;
				}
			}

			return true;
		},
		async jwt({ token, user }) {
			if (!user) return token;

			const col = Collections.users;
			const doc = await col.doc(user.id).get();
			const data = doc.data() as User | undefined;

			if (!doc.exists || !data) return token;
			token.role = data.metadata.role;
			token.name = data.name;
			token.picture = data.avatarUrl || user.image;
			return token;
		},
		async session({ session, token }) {
			if (session.user) {
				session.user.role = token.role;
				session.user.id = token.sub;
			}
			return session;
		},
	},
	pages: {
		signIn: "/conta",
		signOut: "/conta/dados",
	},
});
