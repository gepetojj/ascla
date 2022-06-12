import type { DefaultResponse } from "entities/DefaultResponse";
import { apiHandler } from "helpers/apiHandler";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse<DefaultResponse>) {
	return apiHandler(req, res, { method: "delete", col: "patrons", role: "admin" }, async col => {
		const { id } = req.query;

		if (!id || typeof id !== "string") {
			res.status(400).json({ message: "Informe o ID do patrono." });
			return res;
		}

		try {
			await col.doc(id).delete();
			res.json({ message: "Patrono deletado com sucesso." });
		} catch (err) {
			console.error(err);
			res.status(500).json({ message: "Não foi possível deletar o patrono." });
		}

		return res;
	});
}
