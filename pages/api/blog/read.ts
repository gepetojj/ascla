import type { Academic } from "entities/Academic";
import type { BlogPost } from "entities/BlogPost";
import type { DefaultResponse } from "entities/DefaultResponse";
import type { User } from "entities/User";
import { apiHandler } from "helpers/apiHandler";
import { getData } from "helpers/getData";
import type { NextApiRequest, NextApiResponse } from "next";

interface Response extends DefaultResponse {
	post?: BlogPost;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Response>) {
	return apiHandler(req, res, { method: "get", col: "blogPosts" }, async col => {
		const postUrlId = req.query.urlId;
		let withAuthor = false;

		if (!postUrlId || typeof postUrlId !== "string") {
			res.status(400).json({ message: "Informe o ID do post." });
			return res;
		}

		// Retorna o objeto completo do autor caso exista
		if (typeof req.query.author === "string" && req.query.author === "true") {
			withAuthor = true;
		}

		try {
			const query = await col.where("metadata.urlId", "==", postUrlId).get();

			if (query.empty || !query.docs.length) {
				res.status(404).json({ message: "Post não encontrado." });
				return res;
			}

			const post = query.docs[0].data() as BlogPost;
			if (!withAuthor) {
				res.json({ message: "Post listado com sucesso.", post });
				return res;
			}

			const newPost: BlogPost<true> = post;
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
