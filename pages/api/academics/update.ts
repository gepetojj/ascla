import type { JSONContent } from "@tiptap/react";

import type { Academic, UpdatableAcademic } from "entities/Academic";
import type { DefaultResponse } from "entities/DefaultResponse";
import { apiHandler } from "helpers/apiHandler";
import type { NextApiRequest, NextApiResponse } from "next";

interface UpdateAcademic {
	id?: string;
	name?: string;
	patronId?: string;
	bio?: JSONContent;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<DefaultResponse>) {
	return apiHandler(req, res, { method: "put", col: "academics", adminOnly: true }, async col => {
		const { id, name, patronId, bio }: UpdateAcademic = req.body;

		// TODO: Adicionar validação aos dados
		if (!id) {
			res.status(400).json({ message: "Informe o ID do acadêmico." });
			return res;
		}

		try {
			const query = await col.doc(id).get();
			const originalAcademic = query.data() as Academic;

			if (!query.exists || !originalAcademic) {
				res.status(400).json({ message: "Acadêmico não encontrado." });
				return res;
			}

			const academic: UpdatableAcademic = {
				metadata: {
					...originalAcademic.metadata,
					updatedAt: Date.now(),
				},
			};

			if (name && typeof name === "string") academic.name = name;
			if (patronId && typeof patronId === "string") academic.metadata.patronId = patronId;
			if (bio && bio.content?.length) academic.bio = bio;

			await col.doc(id).update(academic);
			res.json({ message: "Acadêmico atualizado com sucesso." });
		} catch (err) {
			console.error(err);
			res.status(500).json({ message: "Não foi possível atualizar o acadêmico." });
		}

		return res;
	});
}