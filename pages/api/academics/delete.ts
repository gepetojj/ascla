import type { DefaultResponse } from "entities/DefaultResponse";
import { apiHandler } from "helpers/apiHandler";
import type { NextApiRequest, NextApiResponse } from "next";
import { academicsRepo } from "repositories/implementations";

export default async function handler(req: NextApiRequest, res: NextApiResponse<DefaultResponse>) {
	return apiHandler(req, res, { method: "delete", col: "academics", role: "admin" }, async () => {
		const { id } = req.query;

		if (!id || typeof id !== "string") {
			res.status(400).json({ message: "Informe o ID do acadêmico." });
			return res;
		}

		try {
			const deleted = await academicsRepo.delete(id);
			if (!deleted) {
				res.status(500).json({ message: "Não foi possível remover o acadêmico." });
				return res;
			}

			res.json({ message: "Acadêmico deletado com sucesso." });
		} catch (err) {
			console.error(err);
			res.status(500).json({ message: "Não foi possível deletar o acadêmico." });
		}

		return res;
	});
}
