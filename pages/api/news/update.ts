import type { JSONContent } from "@tiptap/react";

import type { BlogPost, UpdatableBlogPost } from "entities/BlogPost";
import type { DefaultResponse } from "entities/DefaultResponse";
import { apiHandler } from "helpers/apiHandler";
import type { NextApiRequest, NextApiResponse } from "next";

interface UpdateNews {
	id?: string;
	title?: string;
	description?: string;
	thumbnailUrl?: string;
	content?: JSONContent;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<DefaultResponse>) {
	return apiHandler(req, res, { method: "put", col: "news", role: "admin" }, async col => {
		const { id, title, description, content }: UpdateNews = req.body;

		// TODO: Adicionar validação aos dados
		if (!id) {
			res.status(400).json({ message: "Informe o ID da notícia." });
			return res;
		}

		try {
			const query = await col.doc(id).get();
			const originalNews = query.data() as BlogPost;

			if (!query.exists || !originalNews) {
				res.status(400).json({ message: "Notícia não encontrada." });
				return res;
			}

			const news: UpdatableBlogPost = {
				metadata: {
					...originalNews.metadata,
					updatedAt: Date.now(),
				},
			};

			if (title && typeof title === "string") news.title = title;
			if (description && typeof description === "string") news.description = description;
			if (content && content.content?.length) news.content = content;

			await col.doc(id).update(news);
			res.json({ message: "Notícia atualizada com sucesso." });
		} catch (err) {
			console.error(err);
			res.status(500).json({ message: "Não foi possível atualizar a notícia." });
		}

		return res;
	});
}
