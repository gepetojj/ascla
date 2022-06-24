import type { JSONContent } from "@tiptap/react";

import type { BlogPost, UpdatableBlogPost } from "entities/BlogPost";
import type { DefaultResponse } from "entities/DefaultResponse";
import { apiHandler } from "helpers/apiHandler";
import type { NextApiRequest, NextApiResponse } from "next";

interface UpdatePost {
	id?: string;
	title?: string;
	description?: string;
	thumbnailUrl?: string;
	content?: JSONContent;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<DefaultResponse>) {
	return apiHandler(
		req,
		res,
		{ method: "put", col: "blogPosts", role: "academic" },
		async (col, session) => {
			const { id, title, description, content }: UpdatePost = req.body;

			// TODO: Adicionar validação aos dados
			if (!id) {
				res.status(400).json({ message: "Informe o ID da postagem." });
				return res;
			}

			try {
				const query = await col.doc(id).get();
				const originalPost = query.data() as BlogPost;

				if (!query.exists || !originalPost) {
					res.status(400).json({ message: "Postagem não encontrada." });
					return res;
				}

				if (
					session?.role === "academic" &&
					originalPost.metadata.authorId !== session?.sub
				) {
					res.status(401).json({ message: "Esta postagem não é sua." });
					return res;
				}

				const post: UpdatableBlogPost = {
					metadata: {
						...originalPost.metadata,
						updatedAt: Date.now(),
					},
				};

				if (title && typeof title === "string") post.title = title;
				if (description && typeof description === "string") post.description = description;
				if (content && content.content?.length) post.content = content;

				await col.doc(id).update(post);
				res.json({ message: "Postagem atualizada com sucesso." });
			} catch (err) {
				console.error(err);
				res.status(500).json({ message: "Não foi possível atualizar a postagem." });
			}

			return res;
		}
	);
}
