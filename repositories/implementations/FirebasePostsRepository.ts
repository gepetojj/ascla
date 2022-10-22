import { Post, UpdatablePost } from "entities/Post";
import { Collections } from "myFirebase/enums";
import type {
	CreatePostDTO,
	PostsPagination,
	PostsRepository,
	PostsType,
	UpdatePostDTO,
} from "repositories/PostsRepository";
import { v4 as uuid } from "uuid";

export class FirebasePostsRepository implements PostsRepository {
	async getById(id: string, type: PostsType): Promise<Post<false> | undefined> {
		if (!id || !type) throw new Error("O ID e o tipo são necessários para encontrar os dados.");
		const col = Collections[type];

		try {
			const query = await col.doc(id).get();
			const data = query.data() as Post | undefined;
			return data;
		} catch (err) {
			console.trace(err);
			return undefined;
		}
	}

	async getBySlug(slug: string, type: PostsType): Promise<Post<false> | undefined> {
		if (!slug || !type)
			throw new Error("O slug e o tipo são necessários para encontrar os dados.");
		const col = Collections[type];

		try {
			const query = await col.where("metadata.urlId", "==", slug).get();
			if (query.empty || !query.docs) return undefined;
			const data = query.docs[0].data() as Post | undefined;
			return data;
		} catch (err) {
			console.trace(err);
			return undefined;
		}
	}

	async getAll(
		type: PostsType,
		pagination?: PostsPagination
	): Promise<Post<false>[] | undefined> {
		if (!type) throw new Error("O tipo é necessário para encontrar os dados.");
		const col = Collections[type];

		try {
			const query = col.orderBy("metadata.createdAt", "desc");

			if (pagination) {
				query.limit(pagination.limit).offset(pagination.page * pagination.limit);
			}

			const queryData = await query.get();
			if (queryData.empty || !queryData.docs) return undefined;

			const posts: Post[] = [];
			for (const post of queryData.docs) {
				const data = post.data() as Post;
				posts.push(data);
			}
			return posts;
		} catch (err) {
			console.trace(err);
			return undefined;
		}
	}

	async create(
		{ id, title, description, thumbnailUrl, content, authorId, slug }: CreatePostDTO,
		type: PostsType
	): Promise<boolean> {
		if (!type) throw new Error("O tipo é necessário para encontrar os dados.");
		const col = Collections[type];

		try {
			const data: Post = {
				id: id || uuid(),
				metadata: {
					authorId,
					urlId: slug,
					createdAt: Date.now(),
					updatedAt: 0,
				},
				title,
				description,
				thumbnailUrl,
				content,
			};
			await col.doc(data.id).create(data);
			return true;
		} catch (err) {
			console.trace(err);
			return false;
		}
	}

	async update(
		id: string,
		type: PostsType,
		{ title, description, thumbnailUrl, content }: UpdatePostDTO
	): Promise<boolean> {
		if (!id || !type) throw new Error("O ID e o tipo são necessários para encontrar os dados.");
		const col = Collections[type];

		try {
			const post: UpdatablePost = {
				"metadata.updatedAt": Date.now(),
			};

			if (title && typeof title === "string") post.title = title;
			if (description && typeof description == "string") post.description = description;
			if (thumbnailUrl && typeof thumbnailUrl == "string") post.thumbnailUrl = thumbnailUrl;
			if (content && content.content?.length) post.content = content;

			// Não atualiza o documento caso nenhum campo tenha mudado além da data de atualização
			if (Object.keys(post).length <= 1) return false;

			await col.doc(id).update(post);
			return true;
		} catch (err) {
			console.trace(err);
			return false;
		}
	}

	async delete(id: string, type: PostsType): Promise<boolean> {
		if (!id || !type) throw new Error("O ID e o tipo são necessários para encontrar os dados.");
		const col = Collections[type];

		try {
			await col.doc(id).delete();
			return true;
		} catch (err) {
			console.trace(err);
			return false;
		}
	}
}
