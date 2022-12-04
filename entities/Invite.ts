import type { Academic } from "./Academic";
import type { User, UserRole } from "./User";

export interface Invite {
	id: string;
	generatedBy: User["id"];
	role: UserRole;
	academicId?: Academic["id"];
	infinite: boolean;
	valid: boolean;
	usedBy?: User["id"];
}
