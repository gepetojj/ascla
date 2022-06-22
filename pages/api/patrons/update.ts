import type { JSONContent } from "@tiptap/react";

import type { DefaultResponse } from "entities/DefaultResponse";
import type { Patron, UpdatablePatron } from "entities/Patron";
import { apiHandler } from "helpers/apiHandler";
import type { NextApiRequest, NextApiResponse } from "next";

interface UpdatePatron {
	id?: string;
	name?: string;
	academicId?: string;
	chair?: number;
	bio?: JSONContent;
	avatar?: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<DefaultResponse>) {
	return apiHandler(req, res, { method: "put", col: "patrons", role: "admin" }, async col => {
		const { id, name, academicId, chair, avatar, bio }: UpdatePatron = req.body;

		// TODO: Adicionar validação aos dados
		if (!id) {
			res.status(400).json({ message: "Informe o ID do patrono." });
			return res;
		}

		try {
			const query = await col.doc(id).get();
			const originalPatron = query.data() as Patron;

			if (!query.exists || !originalPatron) {
				res.status(400).json({ message: "Patrono não encontrado." });
				return res;
			}

			const patron: UpdatablePatron = {
				metadata: {
					...originalPatron.metadata,
					updatedAt: Date.now(),
				},
			};

			if (name && typeof name === "string") patron.name = name;
			if (academicId && typeof academicId === "string")
				patron.metadata.academicId = academicId;
			if (chair && typeof chair === "number") patron.metadata.chair = chair;
			if (avatar && typeof avatar === "string") patron.avatar = avatar;
			if (bio && bio.content?.length) patron.bio = bio;

			// Verificar a diferença entre patron e originalPatron; não havendo mudanças,
			// enviar resposta diferente.

			await col.doc(id).update(patron);
			res.json({ message: "Patrono atualizado com sucesso." });
		} catch (err) {
			console.error(err);
			res.status(500).json({ message: "Não foi possível atualizar o patrono." });
		}

		return res;
	});
}
