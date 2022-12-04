import type { JSONContent } from "@tiptap/core";

import type { DefaultResponse } from "entities/DefaultResponse";
import { apiHandler } from "helpers/apiHandler";
import { getIdFromText } from "helpers/getIdFromText";
import { Collections } from "myFirebase/enums";
import type { NextApiRequest, NextApiResponse } from "next";
import { PostsType, PostsTypes } from "repositories/PostsRepository";
import { postsRepo } from "repositories/implementations";

interface NewPost {
	title: string;
	description: string;
	thumbnailUrl: string;
	content: JSONContent;
	authorId?: string;
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

			const { title, description, thumbnailUrl, content, authorId }: NewPost = req.body;
			let authorUserId = session.sub;

			// TODO: Adicionar validação aos dados
			if (!title || !description || !thumbnailUrl || !content.content?.length) {
				res.status(400).json({ message: "Informe os dados da postagem corretamente." });
				return res;
			}

			try {
				const slug = getIdFromText(title);
				const slugExists = await postsRepo.getBySlug(slug, type);
				if (slugExists) {
					res.status(400).json({ message: "Uma postagem com o mesmo título já existe." });
					return res;
				}

				if (authorId) {
					const author = await Collections["users"]
						.where("metadata.academicId", "==", authorId)
						.get();
					if (!author.empty && author.docs[0].exists) {
						authorUserId = author.docs[0].data().id || session.sub;
					} else {
						res.status(400).json({
							message:
								"É necessário que um usuário esteja registrado como este acadêmico.",
						});
						return res;
					}
				}

				await postsRepo.create(
					{
						title,
						description,
						thumbnailUrl,
						content,
						authorId: authorUserId,
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
