import type { JSONContent } from "@tiptap/core";

import type { Post } from "entities/Post";

export const PostsTypes = ["blogPosts", "news"] as const;
export type PostsType = "blogPosts" | "news";

export interface CreatePostDTO {
	id?: string;
	title: string;
	description: string;
	thumbnailUrl: string;
	content: JSONContent;
	authorId: string;
	slug: string;
}

export interface UpdatePostDTO {
	title?: string;
	description?: string;
	thumbnailUrl?: string;
	content?: JSONContent;
}

export interface PostsRepository {
	getById(id: string, type: PostsType): Promise<Post | undefined>;
	getBySlug(slug: string, type: PostsType): Promise<Post | undefined>;
	getAll(type: PostsType): Promise<Post[] | undefined>;
	create(data: CreatePostDTO, type: PostsType): Promise<boolean>;
	update(id: Post["id"], type: PostsType, data: UpdatePostDTO): Promise<boolean>;
	delete(id: string, type: PostsType): Promise<boolean>;
}
