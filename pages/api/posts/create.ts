import type { JSONContent } from "@tiptap/core";

import type { DefaultResponse } from "entities/DefaultResponse";
import { apiHandler } from "helpers/apiHandler";
import { getIdFromText } from "helpers/getIdFromText";
import type { NextApiRequest, NextApiResponse } from "next";
import { PostsType, PostsTypes } from "repositories/PostsRepository";
import { postsRepo } from "repositories/implementations";

interface NewPost {
	title: string;
	description: string;
	thumbnailUrl: string;
	content: JSONContent;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<DefaultResponse>) {
	return apiHandler(
		req,
		res,
		{ method: "post", col: "blogPosts", role: "academic" },
		async (_, session) => {
			if (!session?.sub) {
				res.status(401).json({ message: "Houve um erro com sua sessão." });
				return res;
			}

			let type: PostsType = "blogPosts";
			if (
				typeof req.query.type === "string" &&
				PostsTypes.includes(req.query.type as PostsType)
			) {
				type = req.query.type as PostsType;
			}

			const { title, description, thumbnailUrl, content }: NewPost = req.body;

			// TODO: Adicionar validação aos dados
			if (!title || !description || !thumbnailUrl || !content.content?.length) {
				res.status(400).json({ message: "Informe os dados da postagem corretamente." });
				return res;
			}

			try {
				const slug = getIdFromText(title);
				const slugExists = await postsRepo.getBySlug(slug, type);
				if (slugExists) {
					res.status(400).json({ message: "Uma postagem com o mesmo nome já existe." });
					return res;
				}

				await postsRepo.create(
					{
						title,
						description,
						thumbnailUrl,
						content,
						authorId: session.sub,
						slug,
					},
					type
				);
				res.json({ message: "Postagem criada com sucesso." });
			} catch (err) {
				console.error(err);
				res.status(500).json({ message: "Não foi possível criar a postagem." });
			}

			return res;
		}
	);
}
