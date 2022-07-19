import { Academic } from "entities/Academic";
import type { BlogPost } from "entities/BlogPost";
import type { DefaultResponse } from "entities/DefaultResponse";
import type { User } from "entities/User";
import { apiHandler } from "helpers/apiHandler";
import { getData } from "helpers/getData";
import type { NextApiRequest, NextApiResponse } from "next";

interface Response extends DefaultResponse {
	posts?: BlogPost[];
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Response>) {
	return apiHandler(req, res, { method: "get", col: "blogPosts" }, async col => {
		try {
			let query = col.orderBy("metadata.createdAt", "desc");
			let withAuthor = false;

			// Retorna apenas o post mais recente caso exista
			if (typeof req.query.latest === "string" && req.query.latest === "true") {
				query = query.limit(1);
			}

			// Retorna o objeto completo do autor caso exista
			if (typeof req.query.author === "string" && req.query.author === "true") {
				withAuthor = true;
			}

			const queryExec = await query.get();
			const posts: BlogPost<typeof withAuthor>[] = [];
			for (const post of queryExec.docs) {
				const data = post.data() as BlogPost;
				const newData: BlogPost<true> = data;

				if (!withAuthor) {
					posts.push(data);
					continue;
				}

				const user = await getData<User>(data.metadata.authorId, "users");
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

			res.json({ message: "Posts listados com sucesso.", posts });
		} catch (err) {
			console.error(err);
			res.status(500).json({ message: "Não foi possível listar os posts." });
		}

		return res;
	});
}
