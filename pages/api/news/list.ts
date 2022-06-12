import type { BlogPost } from "entities/BlogPost";
import type { DefaultResponse } from "entities/DefaultResponse";
import { apiHandler } from "helpers/apiHandler";
import type { NextApiRequest, NextApiResponse } from "next";

interface Response extends DefaultResponse {
	news?: BlogPost[];
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Response>) {
	return apiHandler(req, res, { method: "get", col: "news" }, async col => {
		try {
			const query = await col.get();
			const news: BlogPost[] = [];

			query.forEach(post => news.push(post.data() as BlogPost));

			res.json({ message: "Notícias listadas com sucesso.", news });
		} catch (err) {
			console.error(err);
			res.status(500).json({ message: "Não foi possível listar as notícias." });
		}

		return res;
	});
}
