import type { DefaultResponse } from "entities/DefaultResponse";
import type { User } from "entities/User";
import { apiHandler } from "helpers/apiHandler";
import type { NextApiRequest, NextApiResponse } from "next";

interface Response extends DefaultResponse {
	user?: User;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Response>) {
	return apiHandler(req, res, { method: "get", col: "users" }, async (col, session) => {
		try {
			const { id } = req.query;

			if (!id || typeof id !== "string") {
				res.status(400).json({ message: "Informe o ID do usuário." });
				return res;
			}

			const query = await col.doc(id).get();
			if (!query.exists) {
				res.status(404).json({ message: "Usuário não encontrado." });
				return res;
			}

			const user = query.data() as User;

			if (user.metadata.role !== "common" || session?.role === "admin") {
				res.json({ message: "Usuário listado com sucesso.", user });
				return res;
			}
			res.status(401).json({ message: "Você não tem permissão para acessar esse conteúdo." });
		} catch (err) {
			console.error(err);
			res.status(500).json({ message: "Não foi possível listar o usuário." });
		}

		return res;
	});
}
