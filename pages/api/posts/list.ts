import { Academic } from "entities/Academic";
import type { DefaultResponse } from "entities/DefaultResponse";
import type { Post } from "entities/Post";
import type { User } from "entities/User";
import { apiHandler } from "helpers/apiHandler";
import { getData } from "helpers/getData";
import type { NextApiRequest, NextApiResponse } from "next";
import { PostsType, PostsTypes } from "repositories/PostsRepository";
import { postsRepo } from "repositories/implementations";

interface Response extends DefaultResponse {
	posts?: Post[];
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Response>) {
	return apiHandler(req, res, { method: "get", col: "blogPosts" }, async () => {
		try {
			let withAuthor = false;
			let type: PostsType = "blogPosts";

			if (
				typeof req.query.type === "string" &&
				PostsTypes.includes(req.query.type as PostsType)
			) {
				type = req.query.type as PostsType;
			}

			const allPosts = await postsRepo.getAll(type);
			if (!allPosts) {
				res.status(500).json({ message: "Nenhuma postagem foi encontrada." });
				return res;
			}

			// Retorna apenas o post mais recente caso exista
			if (typeof req.query.latest === "string" && req.query.latest === "true") {
				allPosts.length = 1;
			}

			// Retorna o objeto completo do autor caso exista
			if (typeof req.query.author === "string" && req.query.author === "true") {
				withAuthor = true;
			}

			const posts: Post<typeof withAuthor>[] = [];
			for (const post of allPosts) {
				const newData: Post<true> = post;

				if (!withAuthor) {
					posts.push(post);
					continue;
				}

				const user = await getData<User>(post.metadata.authorId, "users");
				if (user) {
					newData.metadata.author = user;

					if (user.metadata.academicId) {
						const academic = await getData<Academic>(
							user.metadata.academicId,
							"academics"
						);
						if (academic) newData.metadata.author = academic;
					}
				}

				posts.push(newData);
			}

			res.json({ message: "Postagens listadas com sucesso.", posts });
		} catch (err) {
			console.error(err);
			res.status(500).json({ message: "Não foi possível listar as postagens." });
		}

		return res;
	});
}
