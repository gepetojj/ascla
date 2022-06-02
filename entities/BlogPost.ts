import type { JSONContent } from "@tiptap/react";

import type { User } from "entities/User";

export interface BlogPostMetadata {
	urlId: string; // custom (user chooses) or uuid
	createdAt: number; // timestamp
	updatedAt: number; // timestamp
	authorId: User["id"];
}

export interface BlogPost {
	id: string; // uuid
	metadata: BlogPostMetadata;
	title: string;
	description: string;
	thumbnailUrl?: string; // Thumbnail image
	content: JSONContent;
}

export interface UpdatableBlogPost {
	metadata: BlogPostMetadata;
	title?: string;
	description?: string;
	thumbnailUrl?: string;
	content?: JSONContent;
}
