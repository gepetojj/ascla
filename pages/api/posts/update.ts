import type { JSONContent } from "@tiptap/core";

import type { DefaultResponse } from "entities/DefaultResponse";
import { apiHandler } from "helpers/apiHandler";
import type { NextApiRequest, NextApiResponse } from "next";
import { PostsType, PostsTypes } from "repositories/PostsRepository";
import { postsRepo } from "repositories/implementations";

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
		async (_, session) => {
			const { id, title, description, thumbnailUrl, content }: UpdatePost = req.body;

			// TODO: Adicionar validação aos dados
			if (!id) {
				res.status(400).json({ message: "Informe o ID da postagem." });
				return res;
			}

			let type: PostsType = "blogPosts";
			if (
				typeof req.query.type === "string" &&
				PostsTypes.includes(req.query.type as PostsType)
			) {
				type = req.query.type as PostsType;
			}

			try {
				const originalPost = await postsRepo.getById(id, type);
				if (!originalPost) {
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

				await postsRepo.update(id, type, {
					title,
					description,
					thumbnailUrl,
					content,
				});
				res.json({ message: "Postagem atualizada com sucesso." });
			} catch (err) {
				console.error(err);
				res.status(500).json({ message: "Não foi possível atualizar a postagem." });
			}

			return res;
		}
	);
}
