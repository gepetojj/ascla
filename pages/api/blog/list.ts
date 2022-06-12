import type { BlogPost } from "entities/BlogPost";
import type { DefaultResponse } from "entities/DefaultResponse";
import { apiHandler } from "helpers/apiHandler";
import type { NextApiRequest, NextApiResponse } from "next";

interface Response extends DefaultResponse {
	posts?: BlogPost[];
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Response>) {
	return apiHandler(req, res, { method: "get", col: "blogPosts" }, async col => {
		try {
			const query = await col.get();
			const posts: BlogPost[] = [];

			query.forEach(post => posts.push(post.data() as BlogPost));

			res.json({ message: "Posts listados com sucesso.", posts });
		} catch (err) {
			console.error(err);
			res.status(500).json({ message: "Não foi possível listar os posts." });
		}

		return res;
	});
}
