import type { DefaultResponse } from "entities/DefaultResponse";
import type { Patron } from "entities/Patron";
import { apiHandler } from "helpers/apiHandler";
import type { NextApiRequest, NextApiResponse } from "next";
import { patronsRepo } from "repositories/implementations";

interface Response extends DefaultResponse {
	patron?: Patron;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Response>) {
	return apiHandler(req, res, { method: "get", col: "patrons" }, async () => {
		try {
			const { id } = req.query;

			if (!id || typeof id !== "string") {
				res.status(400).json({ message: "Informe o ID do patrono." });
				return res;
			}

			let patron = await patronsRepo.getById(id);
			if (!patron) patron = await patronsRepo.getBySlug(id);

			if (!patron) {
				res.status(404).json({ message: "Patrono não encontrado." });
				return res;
			}

			res.json({ message: "Patrono listado com sucesso.", patron });
		} catch (err) {
			console.error(err);
			res.status(500).json({ message: "Não foi possível listar o patrono." });
		}

		return res;
	});
}
