import type { JSONContent } from "@tiptap/react";

import type { DefaultResponse } from "entities/DefaultResponse";
import type { Patron } from "entities/Patron";
import { apiHandler } from "helpers/apiHandler";
import { getIdFromText } from "helpers/getIdFromText";
import type { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuid } from "uuid";

interface NewPatron {
	name: string;
	academicId: string;
	chair: number;
	avatarUrl?: string;
	bio: JSONContent;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<DefaultResponse>) {
	return apiHandler(req, res, { method: "post", col: "patrons", role: "admin" }, async col => {
		const { name, academicId, chair, bio }: NewPatron = req.body;
		const customUrl = getIdFromText(name);

		// TODO: Adicionar validação aos dados
		if (!name || !academicId || !chair || !bio.content?.length) {
			res.status(400).json({ message: "Informe os dados do patrono corretamente." });
			return res;
		}

		try {
			const query = await col.where("metadata.urlId", "==", customUrl).get();
			if (!query.empty || query.docs.length) {
				res.status(400).json({ message: "O ID customizado do patrono já existe." });
				return res;
			}

			const patron: Patron = {
				id: uuid(),
				metadata: {
					urlId: customUrl,
					createdAt: Date.now(),
					updatedAt: 0,
					academicId,
					chair,
				},
				name,
				bio,
			};

			await col.doc(patron.id).create(patron);
			res.json({ message: "Patrono criado com sucesso." });
		} catch (err) {
			console.error(err);
			res.status(500).json({ message: "Não foi possível criar o patrono." });
		}

		return res;
	});
}
