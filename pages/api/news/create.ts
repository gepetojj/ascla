import type { JSONContent } from "@tiptap/react";

import type { BlogPost } from "entities/BlogPost";
import type { DefaultResponse } from "entities/DefaultResponse";
import { apiHandler } from "helpers/apiHandler";
import type { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuid } from "uuid";

interface NewNewsPost {
	title: string;
	description: string;
	customUrl: string;
	thumbnailUrl?: string;
	content: JSONContent;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<DefaultResponse>) {
	return apiHandler(
		req,
		res,
		{ method: "post", col: "news", role: "admin" },
		async (col, session) => {
			if (!session?.sub) {
				res.status(401).json({ message: "Houve um erro com sua sessão." });
				return res;
			}

			const { title, description, customUrl, content }: NewNewsPost = req.body;

			// TODO: Adicionar validação aos dados
			if (!title || !description || !content.content?.length) {
				res.status(400).json({ message: "Informe os dados da notícia corretamente." });
				return res;
			}

			if (customUrl && typeof customUrl === "string") {
				const query = await col.where("metadata.urlId", "==", customUrl).get();
				if (!query.empty || query.docs.length) {
					res.status(400).json({ message: "A URL Personalizada já existe." });
					return res;
				}
			}

			const news: BlogPost = {
				id: uuid(),
				metadata: {
					urlId: customUrl || uuid(),
					createdAt: Date.now(),
					updatedAt: 0,
					authorId: session.sub,
				},
				title,
				description,
				content,
			};

			try {
				await col.doc(news.id).create(news);
				res.json({ message: "Notícia criada com sucesso." });
			} catch (err) {
				console.error(err);
				res.status(500).json({ message: "Não foi possível criar a notícia." });
			}

			return res;
		}
	);
}
