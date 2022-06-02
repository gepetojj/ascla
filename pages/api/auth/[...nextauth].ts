import type { User } from "entities/User";
import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";

import { firestore } from "../../../firebase/server";

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
			const users = firestore.collection("users");
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
				bio: "",
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

			/* // Atualiza os dados do usuário caso estejam diferentes.
			const data = query.docs[0].data();
			if (data !== user) {
				try {
					await users.doc(user.id).update(user);
				} catch (err) {
					console.error(err);
					return false;
				}
			} */

			return true;
		},
		async jwt({ token, user }) {
			if (!user) return token;

			const userDoc = await firestore.collection("users").doc(user.id).get();
			const data = userDoc.data() as User | undefined;

			if (!userDoc.exists || !data) return token;
			token.role = data.metadata.role;
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
	},
});
