import type { JSONContent } from "@tiptap/react";

import type { Patron } from "./Patron";

export interface AcademicMetadata {
	urlId: string;
	createdAt: number;
	updatedAt: number;
	patronId: Patron["id"];
}

export interface Academic {
	id: string;
	name: string;
	bio: JSONContent;
	avatarUrl?: string;
	metadata: AcademicMetadata;
}

export interface UpdatableAcademic {
	name?: string;
	bio?: JSONContent;
	avatarUrl?: string;
	metadata: AcademicMetadata;
}
