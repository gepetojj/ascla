import type { Academic } from "entities/Academic";
import type { DefaultResponse } from "entities/DefaultResponse";
import type { Post } from "entities/Post";
import type { User } from "entities/User";
import { apiHandler } from "helpers/apiHandler";
import { getData } from "helpers/getData";
import type { NextApiRequest, NextApiResponse } from "next";
import { PostsType, PostsTypes } from "repositories/PostsRepository";
import { postsRepo } from "repositories/implementations";

interface Response extends DefaultResponse {
	post?: Post;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Response>) {
	return apiHandler(req, res, { method: "get", col: "blogPosts" }, async () => {
		const urlId = req.query.urlId;

		let withAuthor = false;
		let type: PostsType = "blogPosts";

		if (!urlId || typeof urlId !== "string") {
			res.status(400).json({ message: "Informe o ID do post." });
			return res;
		}

		// Retorna o objeto completo do autor caso exista
		if (typeof req.query.author === "string" && req.query.author === "true") {
			withAuthor = true;
		}

		if (
			typeof req.query.type === "string" &&
			PostsTypes.includes(req.query.type as PostsType)
		) {
			type = req.query.type as PostsType;
		}

		try {
			const post = await postsRepo.getBySlug(urlId, type);
			if (!post) {
				res.status(404).json({ message: "Post não encontrado." });
				return res;
			}

			if (!withAuthor) {
				res.json({ message: "Post listado com sucesso.", post });
				return res;
			}

			const newPost: Post<true> = post;
			const user = await getData<User>(post.metadata.authorId, "users");
			if (user) {
				newPost.metadata.author = user;

				if (user.metadata.academicId) {
					const academic = await getData<Academic>(user.metadata.academicId, "academics");
					if (academic) newPost.metadata.author = academic;
				}
			}

			res.json({ message: "Post listado com sucesso.", post: newPost });
		} catch (err) {
			console.error(err);
			res.status(500).json({ message: "Não foi possível retornar o post." });
		}

		return res;
	});
}
