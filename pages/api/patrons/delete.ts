import type { DefaultResponse } from "entities/DefaultResponse";
import { apiHandler } from "helpers/apiHandler";
import type { NextApiRequest, NextApiResponse } from "next";
import { patronsRepo } from "repositories/implementations";

export default async function handler(req: NextApiRequest, res: NextApiResponse<DefaultResponse>) {
	return apiHandler(req, res, { method: "delete", col: "patrons", role: "admin" }, async () => {
		const { id } = req.query;

		if (!id || typeof id !== "string") {
			res.status(400).json({ message: "Informe o ID do patrono." });
			return res;
		}

		try {
			const deleted = await patronsRepo.delete(id);
			if (!deleted) {
				res.status(500).json({ message: "Não foi possível remover o patrono." });
				return res;
			}

			res.json({ message: "Patrono deletado com sucesso." });
		} catch (err) {
			console.error(err);
			res.status(500).json({ message: "Não foi possível deletar o patrono." });
		}

		return res;
	});
}
