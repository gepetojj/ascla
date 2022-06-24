import type { BlogPost } from "entities/BlogPost";
import type { DefaultResponse } from "entities/DefaultResponse";
import { apiHandler } from "helpers/apiHandler";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse<DefaultResponse>) {
	return apiHandler(
		req,
		res,
		{ method: "delete", col: "blogPosts", role: "academic" },
		async (col, session) => {
			const { id } = req.query;

			if (!id || typeof id !== "string") {
				res.status(400).json({ message: "Informe o ID do post." });
				return res;
			}

			if (session?.role === "academic") {
				const query = await col.doc(id).get();
				if (!query.exists) {
					res.status(400).json({ message: "Post não encontrado." });
					return res;
				}

				const post = query.data() as BlogPost;
				if (post.metadata.authorId !== session.sub) {
					res.status(401).json({ message: "Esta postagem não é sua." });
					return res;
				}
			}

			try {
				await col.doc(id).delete();
				res.json({ message: "Post deletado com sucesso." });
			} catch (err) {
				console.error(err);
				res.status(500).json({ message: "Não foi possível deletar o post." });
			}

			return res;
		}
	);
}
