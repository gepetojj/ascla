import type { BlogPost } from "entities/BlogPost";
import type { DefaultResponse } from "entities/DefaultResponse";
import { apiHandler } from "helpers/apiHandler";
import type { NextApiRequest, NextApiResponse } from "next";

interface Response extends DefaultResponse {
	post?: BlogPost;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Response>) {
	return apiHandler(req, res, { method: "get", col: "posts" }, async col => {
		const postUrlId = req.query.urlId;

		if (!postUrlId || typeof postUrlId !== "string") {
			res.status(400).json({ message: "Informe o ID do post." });
			return res;
		}

		try {
			const query = await col.where("metadata.urlId", "==", postUrlId).get();

			if (query.empty || !query.docs.length) {
				res.status(404).json({ message: "Post não encontrado." });
				return res;
			}

			const post = query.docs[0].data() as BlogPost;
			res.json({ message: "Post listado com sucesso.", post });
		} catch (err) {
			console.error(err);
			res.status(500).json({ message: "Não foi possível retornar o post." });
		}

		return res;
	});
}
