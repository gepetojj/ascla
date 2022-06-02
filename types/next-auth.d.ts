import type { UserRole } from "entities/User";
import type { DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
	interface Session {
		user?: {
			id?: string | null;
			name?: string | null;
			email?: string | null;
			image?: string | null;
			role?: UserRole;
		};
		expires: ISODateString;
	}
}

declare module "next-auth/jwt" {
	interface JWT extends DefaultJWT {
		role?: UserRole;
	}
}
