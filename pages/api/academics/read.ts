import type { Academic } from "entities/Academic";
import type { DefaultResponse } from "entities/DefaultResponse";
import { apiHandler } from "helpers/apiHandler";
import type { NextApiRequest, NextApiResponse } from "next";
import { academicsRepo } from "repositories/implementations";

interface Response extends DefaultResponse {
	academic?: Academic;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Response>) {
	return apiHandler(req, res, { method: "get", col: "academics" }, async () => {
		try {
			const { id } = req.query;

			if (!id || typeof id !== "string") {
				res.status(400).json({ message: "Informe o ID do acadêmico." });
				return res;
			}

			const academic = await academicsRepo.getById(id)
			if (!academic) {
				res.status(404).json({ message: "Acadêmico não encontrado." });
				return res;
			}

			res.json({ message: "Acadêmico listado com sucesso.", academic });
		} catch (err) {
			console.error(err);
			res.status(500).json({ message: "Não foi possível listar o acadêmico." });
		}

		return res;
	});
}
