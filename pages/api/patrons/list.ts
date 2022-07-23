import type { DefaultResponse } from "entities/DefaultResponse";
import type { OptimizedPatron, Patron } from "entities/Patron";
import { apiHandler } from "helpers/apiHandler";
import type { NextApiRequest, NextApiResponse } from "next";
import { patronsRepo } from "repositories/implementations";

interface Response extends DefaultResponse {
	patrons?: Patron[] | OptimizedPatron[];
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Response>) {
	return apiHandler(req, res, { method: "get", col: "patrons" }, async () => {
		try {
			const patrons = await patronsRepo.getAll();
			if (!patrons) {
				res.status(500).json({ message: "Não foi possível concluir a operação." });
				return res;
			}

			if (typeof req.query.optimized === "string" && req.query.optimized === "true") {
				for (const patron of patrons) {
					// @ts-expect-error Na linha abaixo é desejado que o campo não exista.
					patron.bio = undefined;
					// @ts-expect-error Na linha abaixo é desejado que o campo não exista.
					patron.avatarUrl = undefined;
					// @ts-expect-error Na linha abaixo é desejado que o campo não exista.
					patron.metadata.academicId = undefined;
					// @ts-expect-error Na linha abaixo é desejado que o campo não exista.
					patron.metadata.createdAt = undefined;
					// @ts-expect-error Na linha abaixo é desejado que o campo não exista.
					patron.metadata.updatedAt = undefined;
				}
			}

			res.json({ message: "Patronos listados com sucesso.", patrons });
		} catch (err) {
			console.error(err);
			res.status(500).json({ message: "Não foi possível listar os patronos." });
		}

		return res;
	});
}
