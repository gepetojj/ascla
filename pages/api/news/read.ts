import { Academic } from "entities/Academic";
import type { BlogPost } from "entities/BlogPost";
import type { DefaultResponse } from "entities/DefaultResponse";
import { User } from "entities/User";
import { apiHandler } from "helpers/apiHandler";
import { getData } from "helpers/getData";
import type { NextApiRequest, NextApiResponse } from "next";

interface Response extends DefaultResponse {
	news?: BlogPost;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Response>) {
	return apiHandler(req, res, { method: "get", col: "news" }, async col => {
		const newsUrlId = req.query.urlId;
		let withAuthor = false;

		if (!newsUrlId || typeof newsUrlId !== "string") {
			res.status(400).json({ message: "Informe o ID da notícia." });
			return res;
		}

		// Retorna o objeto completo do autor caso exista
		if (typeof req.query.author === "string" && req.query.author === "true") {
			withAuthor = true;
		}

		try {
			const query = await col.where("metadata.urlId", "==", newsUrlId).get();

			if (query.empty || !query.docs.length) {
				res.status(404).json({ message: "Notícia não encontrada." });
				return res;
			}

			const news = query.docs[0].data() as BlogPost;
			if (!withAuthor) {
				res.json({ message: "Notícia listada com sucesso.", news });
				return res;
			}

			const newNews: BlogPost<true> = news;
			const user = await getData<User>(news.metadata.authorId, "users");
			if (user) {
				newNews.metadata.author = user;

				if (user.metadata.academicId) {
					const academic = await getData<Academic>(user.metadata.academicId, "academics");
					if (academic) newNews.metadata.author = academic;
				}
			}

			res.json({ message: "Notícia listada com sucesso.", news: newNews });
		} catch (err) {
			console.error(err);
			res.status(500).json({ message: "Não foi possível retornar a notícia." });
		}

		return res;
	});
}
