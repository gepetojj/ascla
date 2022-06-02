import type { DefaultResponse } from "entities/DefaultResponse";
import type { Patron } from "entities/Patron";
import { apiHandler } from "helpers/apiHandler";
import type { NextApiRequest, NextApiResponse } from "next";

interface Response extends DefaultResponse {
	patrons?: Patron[];
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Response>) {
	return apiHandler(req, res, { method: "get", col: "patrons" }, async col => {
		try {
			const query = await col.get();
			const patrons: Patron[] = [];

			query.forEach(patron => patrons.push(patron.data() as Patron));

			res.json({ message: "Patronos listados com sucesso.", patrons });
		} catch (err) {
			console.error(err);
			res.status(500).json({ message: "Não foi possível listar os patronos." });
		}

		return res;
	});
}
