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

			// Configuração da paginação
			let page = 0; // Min: 0 e Max: 1000
			let limit = 10; // Min: 10 e Max: 100

			if (
				typeof req.query.type === "string" &&
				PostsTypes.includes(req.query.type as PostsType)
			) {
				type = req.query.type as PostsType;
			}

			if (
				typeof req.query.page === "string" &&
				Number(req.query.page) >= 0 &&
				Number(req.query.page) <= 1000
			) {
				page = Number(req.query.page);
			}

			if (
				typeof req.query.limit === "string" &&
				Number(req.query.limit) >= 10 &&
				Number(req.query.limit) <= 100
			) {
				limit = Number(req.query.limit);
			}

			const allPosts = await postsRepo.getAll(type, { page, limit });
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

			const postsAuthors: Academic[] = [];
			const postsAuthorsIds: string[] = [];

			for (let post of allPosts) {
				post = { ...post, content: {} };
				const newData: Post<true> = post;

				if (!withAuthor) {
					posts.push(post);
					continue;
				}

				if (postsAuthorsIds.includes(post.metadata.authorId)) {
					newData.metadata.author =
						postsAuthors[postsAuthorsIds.indexOf(post.metadata.authorId)];
					posts.push(newData);
					continue;
				}

				const user = await getData<User>(post.metadata.authorId, "users");
				if (!user) continue;

				newData.metadata.author = { ...user, bio: {} };
				if (!user.metadata.academicId) continue;

				const academic = await getData<Academic>(user.metadata.academicId, "academics");
				if (academic) {
					newData.metadata.author = { ...academic, bio: {} };

					if (!postsAuthorsIds.includes(user.id)) {
						postsAuthors.push({ ...academic, bio: {} });
						postsAuthorsIds.push(user.id);
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
