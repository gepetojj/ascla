import type { DefaultResponse } from "entities/DefaultResponse";
import type { Patron } from "entities/Patron";
import { apiHandler } from "helpers/apiHandler";
import type { NextApiRequest, NextApiResponse } from "next";

interface Response extends DefaultResponse {
	patron?: Patron;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Response>) {
	return apiHandler(req, res, { method: "get", col: "patrons" }, async col => {
		try {
			const { id } = req.query;

			if (!id || typeof id !== "string") {
				res.status(400).json({ message: "Informe o ID do patrono." });
				return res;
			}

			const query = await col.doc(id).get();
			if (!query.exists) {
				res.status(404).json({ message: "Patrono não encontrado." });
				return res;
			}

			const patron = query.data() as Patron;
			res.json({ message: "Patrono listado com sucesso.", patron });
		} catch (err) {
			console.error(err);
			res.status(500).json({ message: "Não foi possível listar o patrono." });
		}

		return res;
	});
}
