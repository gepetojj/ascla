import type { BlogPost } from "entities/BlogPost";
import type { DefaultResponse } from "entities/DefaultResponse";
import { apiHandler } from "helpers/apiHandler";
import type { NextApiRequest, NextApiResponse } from "next";

interface Response extends DefaultResponse {
	news?: BlogPost;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Response>) {
	return apiHandler(req, res, { method: "get", col: "news" }, async col => {
		const newsUrlId = req.query.urlId;

		if (!newsUrlId || typeof newsUrlId !== "string") {
			res.status(400).json({ message: "Informe o ID da notícia." });
			return res;
		}

		try {
			const query = await col.where("metadata.urlId", "==", newsUrlId).get();

			if (query.empty || !query.docs.length) {
				res.status(404).json({ message: "Notícia não encontrada." });
				return res;
			}

			const news = query.docs[0].data() as BlogPost;
			res.json({ message: "Notícia listada com sucesso.", news });
		} catch (err) {
			console.error(err);
			res.status(500).json({ message: "Não foi possível retornar a notícia." });
		}

		return res;
	});
}
