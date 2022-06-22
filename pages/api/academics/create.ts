import type { JSONContent } from "@tiptap/react";

import type { Academic } from "entities/Academic";
import type { DefaultResponse } from "entities/DefaultResponse";
import { apiHandler } from "helpers/apiHandler";
import { getIdFromText } from "helpers/getIdFromText";
import type { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuid } from "uuid";

interface NewAcademic {
	name: string;
	patronId: string;
	chair: number;
	avatar: string;
	bio: JSONContent;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<DefaultResponse>) {
	return await apiHandler(
		req,
		res,
		{ method: "post", col: "academics", role: "admin" },
		async col => {
			const { name, patronId, chair, avatar, bio }: NewAcademic = req.body;
			const customUrl = getIdFromText(name);

			// TODO: Adicionar validação aos dados
			if (!name || !patronId || !chair || !avatar || !bio.content?.length) {
				res.status(400).json({
					message: "Informe os dados do acadêmico corretamente.",
				});
				return res;
			}

			try {
				const query = await col.where("metadata.urlId", "==", customUrl).get();
				if (!query.empty || query.docs.length) {
					res.status(400).json({ message: "O ID customizado do acadêmico já existe." });
					return res;
				}

				const academic: Academic = {
					id: uuid(),
					metadata: {
						urlId: customUrl,
						createdAt: Date.now(),
						updatedAt: 0,
						patronId,
						chair,
					},
					name,
					bio,
					avatar,
				};

				await col.doc(academic.id).create(academic);
				res.json({ message: "Acadêmico criado com sucesso." });
			} catch (err) {
				console.error(err);
				res.status(500).json({ message: "Não foi possível criar o acadêmico." });
			}

			return res;
		}
	);
}
