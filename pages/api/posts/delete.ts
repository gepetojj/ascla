import type { DefaultResponse } from "entities/DefaultResponse";
import { apiHandler } from "helpers/apiHandler";
import type { NextApiRequest, NextApiResponse } from "next";
import { PostsType, PostsTypes } from "repositories/PostsRepository";
import { postsRepo } from "repositories/implementations";

export default async function handler(req: NextApiRequest, res: NextApiResponse<DefaultResponse>) {
	return apiHandler(
		req,
		res,
		{ method: "delete", col: "blogPosts", role: "academic" },
		async (_, session) => {
			const { id } = req.query;

			let type: PostsType = "blogPosts";
			if (
				typeof req.query.type === "string" &&
				PostsTypes.includes(req.query.type as PostsType)
			) {
				type = req.query.type as PostsType;
			}

			if (!id || typeof id !== "string") {
				res.status(400).json({ message: "Informe o ID do post." });
				return res;
			}

			if (session?.role === "academic") {
				const post = await postsRepo.getById(id, type);
				if (!post) {
					res.status(400).json({ message: "Post não encontrado." });
					return res;
				}

				if (post.metadata.authorId !== session.sub) {
					res.status(401).json({ message: "Esta postagem não é sua." });
					return res;
				}
			}

			try {
				await postsRepo.delete(id, type);
				res.json({ message: "Post deletado com sucesso." });
			} catch (err) {
				console.error(err);
				res.status(500).json({ message: "Não foi possível deletar o post." });
			}

			return res;
		}
	);
}
