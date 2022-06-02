import type { JSONContent } from "@tiptap/react";

import type { Academic } from "./Academic";

export interface PatronMetadata {
	urlId: string;
	createdAt: number;
	updatedAt: number;
	academicId: Academic["id"];
}

export interface Patron {
	id: string;
	name: string;
	bio: JSONContent;
	avatarUrl?: string;
	metadata: PatronMetadata;
}

export interface UpdatablePatron {
	name?: string;
	bio?: JSONContent;
	avatarUrl?: string;
	metadata: PatronMetadata;
}
