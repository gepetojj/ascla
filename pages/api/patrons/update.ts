import type { JSONContent } from "@tiptap/core";

import type { DefaultResponse } from "entities/DefaultResponse";
import { apiHandler } from "helpers/apiHandler";
import { uploadAvatar } from "helpers/uploadAvatar";
import type { NextApiRequest, NextApiResponse } from "next";
import { academicsRepo, patronsRepo } from "repositories/implementations";

interface UpdatePatron {
	id?: string;
	name?: string;
	academicId?: string;
	chair?: number;
	bio?: JSONContent;
	avatar?: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<DefaultResponse>) {
	return apiHandler(
		req,
		res,
		{ method: "put", col: "patrons", role: "admin" },
		async (col, session) => {
			if (!session?.sub) {
				res.status(401).json({ message: "Houve um erro com sua sessão." });
				return res;
			}

			const { id, name, academicId, chair, avatar, bio }: UpdatePatron = req.body;

			// TODO: Adicionar validação aos dados
			if (!id) {
				res.status(400).json({ message: "Informe o ID do patrono." });
				return res;
			}

			try {
				let avatarUrl = "";
				if (avatar && typeof avatar === "string") {
					const upload = await uploadAvatar(avatar, session.sub, id);
					avatarUrl = upload.link;
				}
				const updated = await patronsRepo.update(id, {
					name,
					bio,
					chair,
					avatarUrl,
					academicId,
				});

				// Atualiza a relação entre este patrono e seu acadêmico.
				if (updated && academicId) await academicsRepo.update(academicId, { patronId: id });

				res.json({ message: "Patrono atualizado com sucesso." });
			} catch (err) {
				console.error(err);
				res.status(500).json({ message: "Não foi possível atualizar o patrono." });
			}

			return res;
		}
	);
}
