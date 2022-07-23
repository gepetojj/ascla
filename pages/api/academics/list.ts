import type { Academic, OptimizedAcademic } from "entities/Academic";
import type { DefaultResponse } from "entities/DefaultResponse";
import { apiHandler } from "helpers/apiHandler";
import type { NextApiRequest, NextApiResponse } from "next";
import { academicsRepo } from "repositories/implementations";

interface Response extends DefaultResponse {
	academics?: Academic[] | OptimizedAcademic[];
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Response>) {
	return apiHandler(req, res, { method: "get", col: "academics" }, async () => {
		try {
			const academics = await academicsRepo.getAll();
			if (!academics) {
				res.status(500).json({ message: "Não foi possível concluir a operação." });
				return res;
			}

			if (typeof req.query.optimized === "string" && req.query.optimized === "true") {
				for (const academic of academics) {
					// @ts-expect-error Na linha abaixo é desejado que o campo não exista.
					academic.bio = undefined;
					// @ts-expect-error Na linha abaixo é desejado que o campo não exista.
					academic.avatarUrl = undefined;
					// @ts-expect-error Na linha abaixo é desejado que o campo não exista.
					academic.metadata.patronId = undefined;
					// @ts-expect-error Na linha abaixo é desejado que o campo não exista.
					academic.metadata.createdAt = undefined;
					// @ts-expect-error Na linha abaixo é desejado que o campo não exista.
					academic.metadata.updatedAt = undefined;
				}
			}

			res.json({ message: "Acadêmicos listados com sucesso.", academics });
		} catch (err) {
			console.error(err);
			res.status(500).json({ message: "Não foi possível listar os acadêmicos." });
		}

		return res;
	});
}
