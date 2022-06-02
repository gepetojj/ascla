export type UserRole = "common" | "academic" | "admin";

export interface UserMetadata {
	provider: string; // google, microsoft, etc
	role: UserRole;
	urlId: string; // custom (user chooses) or uuid
}

export interface User {
	id: string; // uuid
	metadata: UserMetadata;
	email: string;
	avatarUrl: string;
	name: string;
	bio: string; // user description
}
