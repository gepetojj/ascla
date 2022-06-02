import type { Academic } from "entities/Academic";
import type { DefaultResponse } from "entities/DefaultResponse";
import { apiHandler } from "helpers/apiHandler";
import type { NextApiRequest, NextApiResponse } from "next";

interface Response extends DefaultResponse {
	academics?: Academic[];
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Response>) {
	return apiHandler(req, res, { method: "get", col: "academics" }, async col => {
		try {
			const query = await col.get();
			const academics: Academic[] = [];

			query.forEach(academic => academics.push(academic.data() as Academic));

			res.json({ message: "Acadêmicos listados com sucesso.", academics });
		} catch (err) {
			console.error(err);
			res.status(500).json({ message: "Não foi possível listar os acadêmicos." });
		}

		return res;
	});
}
